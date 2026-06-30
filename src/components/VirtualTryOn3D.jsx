import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

const EYE_LEFT = [33, 133, 159, 145];
const EYE_RIGHT = [263, 362, 386, 374];
const NOSE_BRIDGE = [168, 6];

// Arquétipos de armações reais (Wayfarer, Aviador, Round, Cat-eye...).
const FRAME_ARCHETYPES = {
  Wayfarer: { kind: "rect", w: 1.08, h: 0.86, r: 0.18, metal: false, depth: 0.14 },
  Aviador: { kind: "aviator", rx: 0.62, ry: 0.54, metal: true, depth: 0.07, doubleBridge: true },
  Redondo: { kind: "ellipse", rx: 0.52, ry: 0.52, metal: true, depth: 0.07 },
  Gatinho: { kind: "cateye", w: 1.02, h: 0.74, r: 0.14, metal: false, depth: 0.12 },
  Quadrado: { kind: "rect", w: 1.02, h: 0.82, r: 0.1, metal: false, depth: 0.13 },
  default: { kind: "rect", w: 1.0, h: 0.8, r: 0.15, metal: false, depth: 0.12 }
};

// ── Geradores de contorno (Vector2[] centrados na origem) ──
function ellipsePts(rx, ry, n = 64) {
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    p.push(new THREE.Vector2(Math.cos(a) * rx, Math.sin(a) * ry));
  }
  return p;
}

function roundedRectPts(w, h, r, per = 8) {
  const hw = w / 2;
  const hh = h / 2;
  const p = [];
  const arc = (cx, cy, a0) => {
    for (let i = 0; i <= per; i++) {
      const a = a0 + (i / per) * (Math.PI / 2);
      p.push(new THREE.Vector2(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
    }
  };
  arc(hw - r, hh - r, 0);
  arc(-hw + r, hh - r, Math.PI / 2);
  arc(-hw + r, -hh + r, Math.PI);
  arc(hw - r, -hh + r, (3 * Math.PI) / 2);
  return p;
}

function aviatorPts(rx, ry, n = 72) {
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    let x = Math.cos(a) * rx;
    let y = Math.sin(a) * ry;
    if (y < 0) {
      // afina a parte inferior, formando a "lágrima" do aviador
      x *= 1 - 0.18 * (-y / ry);
      y *= 1.06;
    }
    p.push(new THREE.Vector2(x, y));
  }
  return p;
}

function cateyePts(w, h, r) {
  const hw = w / 2;
  const hh = h / 2;
  return roundedRectPts(w, h, r, 8).map((p) => {
    const np = p.clone();
    if (p.x > 0 && p.y > 0) {
      np.y += 0.3 * (p.x / hw);
      np.x += 0.08 * (p.y / hh);
    }
    return np;
  });
}

function buildOutline(cfg) {
  if (cfg.kind === "ellipse") return ellipsePts(cfg.rx, cfg.ry);
  if (cfg.kind === "aviator") return aviatorPts(cfg.rx, cfg.ry);
  if (cfg.kind === "cateye") return cateyePts(cfg.w, cfg.h, cfg.r);
  return roundedRectPts(cfg.w, cfg.h, cfg.r, 8);
}

function avg(landmarks, idx) {
  let x = 0, y = 0, z = 0;
  for (const i of idx) {
    x += landmarks[i].x;
    y += landmarks[i].y;
    z += landmarks[i].z ?? 0;
  }
  return { x: x / idx.length, y: y / idx.length, z: z / idx.length };
}

// Layout object-fit: cover (igual ao vídeo exibido).
function coverLayout(sw, sh, cw, ch) {
  const scale = Math.max(cw / sw, ch / sh);
  const rw = sw * scale;
  const rh = sh * scale;
  return { rw, rh, offsetX: (cw - rw) / 2, offsetY: (ch - rh) / 2 };
}

// Constrói uma armação 3D procedural realista tingida pela cor informada.
function buildProceduralGlasses(shape, colorHex) {
  const cfg = FRAME_ARCHETYPES[shape] || FRAME_ARCHETYPES.default;
  const outer = new THREE.Group();
  const inner = new THREE.Group();
  outer.add(inner);

  const frameMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex || "#222222"),
    metalness: cfg.metal ? 0.9 : 0.18,
    roughness: cfg.metal ? 0.3 : 0.5,
    side: THREE.DoubleSide
  });
  const lensMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#9fb6c8"),
    metalness: 0,
    roughness: 0.08,
    transmission: 0.9,
    transparent: true,
    opacity: 0.3,
    thickness: 0.2,
    side: THREE.DoubleSide
  });

  const pts = buildOutline(cfg);
  const innerScale = cfg.metal ? 0.86 : 0.78;
  const depth = cfg.depth || 0.12;
  const maxX = Math.max(...pts.map((p) => Math.abs(p.x)));
  const maxY = Math.max(...pts.map((p) => Math.abs(p.y)));

  const makeRim = () => {
    const shp = new THREE.Shape(pts);
    shp.holes.push(new THREE.Path(pts.map((p) => new THREE.Vector2(p.x * innerScale, p.y * innerScale))));
    const geo = new THREE.ExtrudeGeometry(shp, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2,
      steps: 1
    });
    geo.translate(0, 0, -depth / 2);
    const m = new THREE.Mesh(geo, frameMat);
    m.userData.tintable = true;
    return m;
  };

  const makeLensFill = () => {
    const shp = new THREE.Shape(pts.map((p) => new THREE.Vector2(p.x * innerScale * 0.99, p.y * innerScale * 0.99)));
    const m = new THREE.Mesh(new THREE.ShapeGeometry(shp), lensMat);
    return m;
  };

  const cx = maxX + 0.06;

  const right = new THREE.Group();
  right.add(makeRim());
  right.add(makeLensFill());
  right.position.x = cx;
  const left = right.clone(true);
  left.scale.x = -1;
  left.position.x = -cx;
  inner.add(right, left);

  // Ponte
  const bridgeY = maxY * 0.55;
  if (cfg.doubleBridge) {
    [bridgeY, bridgeY - 0.2].forEach((by) => {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, cx * 0.95, 10), frameMat);
      b.userData.tintable = true;
      b.rotation.z = Math.PI / 2;
      b.position.set(0, by, 0);
      inner.add(b);
    });
  } else {
    const b = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.028, 8, 24, Math.PI), frameMat);
    b.userData.tintable = true;
    b.position.set(0, bridgeY - 0.02, 0);
    inner.add(b);
  }

  // Hastes (temples) indo para trás (-z)
  const templeX = cx + maxX;
  [-1, 1].forEach((side) => {
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.05, 0.05), frameMat);
    t.userData.tintable = true;
    t.position.set(side * templeX, maxY * 0.4, -0.45);
    t.rotation.y = side * 0.55;
    inner.add(t);
  });

  // Normaliza a largura do conjunto para ~2 unidades e centraliza
  const box = new THREE.Box3().setFromObject(inner);
  const size = new THREE.Vector3();
  box.getSize(size);
  if (size.x > 0) inner.scale.setScalar(2 / size.x);
  const box2 = new THREE.Box3().setFromObject(inner);
  const center = new THREE.Vector3();
  box2.getCenter(center);
  inner.position.sub(center);

  return outer;
}

export default function VirtualTryOn3D({ product, onStatus }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const streamRef = useRef(null);
  const landmarkerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const glassesRef = useRef(null);
  const rafRef = useRef(0);
  const smoothRef = useRef({
    pos: new THREE.Vector3(),
    quat: new THREE.Quaternion(),
    scale: 1,
    init: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const colorHex = product?.colorHex || "#222222";

  // Atualiza a cor da armação procedural sem reconstruir tudo.
  useEffect(() => {
    const g = glassesRef.current;
    if (!g) return;
    g.traverse((obj) => {
      if (obj.isMesh && obj.userData?.tintable && obj.material?.color) {
        obj.material.color.set(colorHex);
      }
    });
  }, [colorHex]);

  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      setError("");
      setLoading(true);

      // 1. Câmera
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Seu navegador não suporta acesso à câmera.");
        setLoading(false);
        return;
      }
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
      } catch (err) {
        const n = err?.name;
        setError(
          n === "NotAllowedError" || n === "PermissionDeniedError"
            ? "Permita o acesso à câmera para usar o provador."
            : n === "NotFoundError"
            ? "Nenhuma câmera encontrada."
            : "Não foi possível iniciar a câmera."
        );
        setLoading(false);
        return;
      }
      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play().catch(() => {});

      // 2. FaceLandmarker
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFacialTransformationMatrixes: true,
          minFaceDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6
        });
      } catch (err) {
        if (!cancelled) setError("Não foi possível carregar o rastreador facial.");
        setLoading(false);
        return;
      }
      if (cancelled) return;

      // 3. three.js
      const canvas = canvasRef.current;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      sceneRef.current = scene;
      scene.add(new THREE.AmbientLight(0xffffff, 1.1));
      const dir = new THREE.DirectionalLight(0xffffff, 1.0);
      dir.position.set(0.5, 1, 2);
      scene.add(dir);

      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.z = 6;
      cameraRef.current = camera;

      // Modelo: .glb se houver, senão procedural
      let glasses;
      if (product?.model3dUrl) {
        try {
          const gltf = await new GLTFLoader().loadAsync(product.model3dUrl);
          glasses = gltf.scene;
          // Normaliza para largura ~2 unidades
          const box = new THREE.Box3().setFromObject(glasses);
          const size = new THREE.Vector3();
          box.getSize(size);
          const s = size.x > 0 ? 2 / size.x : 1;
          glasses.scale.setScalar(s);
        } catch {
          glasses = buildProceduralGlasses(product?.shape, colorHex);
        }
      } else {
        glasses = buildProceduralGlasses(product?.shape, colorHex);
      }
      glasses.visible = false;
      glassesRef.current = glasses;
      scene.add(glasses);

      const resize = () => {
        const c = containerRef.current;
        if (!c) return;
        const w = c.clientWidth;
        const h = c.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(containerRef.current);

      if (!cancelled) setLoading(false);

      // 4. Loop de rastreamento + render
      const tmpMat = new THREE.Matrix4();
      const tmpQuat = new THREE.Quaternion();
      const tmpPos = new THREE.Vector3();
      const tmpScl = new THREE.Vector3();
      let lastVideoTime = -1;

      const loop = () => {
        rafRef.current = requestAnimationFrame(loop);
        const lm = landmarkerRef.current;
        const v = videoRef.current;
        if (!lm || !v || v.readyState < 2 || !v.videoWidth) {
          renderer.render(scene, camera);
          return;
        }
        if (v.currentTime === lastVideoTime) {
          renderer.render(scene, camera);
          return;
        }
        lastVideoTime = v.currentTime;

        let result;
        try {
          result = lm.detectForVideo(v, performance.now());
        } catch {
          renderer.render(scene, camera);
          return;
        }

        const landmarks = result.faceLandmarks?.[0];
        const g = glassesRef.current;

        if (!landmarks?.length) {
          if (g) g.visible = false;
          smoothRef.current.init = false;
          onStatus?.({ status: "searching", confidence: 0 });
          renderer.render(scene, camera);
          return;
        }

        const c = containerRef.current;
        const cw = c.clientWidth;
        const ch = c.clientHeight;
        const { rw, rh, offsetX, offsetY } = coverLayout(v.videoWidth, v.videoHeight, cw, ch);

        const leftEye = avg(landmarks, EYE_LEFT);
        const rightEye = avg(landmarks, EYE_RIGHT);
        const nose = avg(landmarks, NOSE_BRIDGE);

        // Posição (px no canvas, espaço não-espelhado; o canvas é espelhado via CSS)
        const eyeCx = (leftEye.x + rightEye.x) / 2;
        const eyeCy = (leftEye.y + rightEye.y) / 2;
        const sx = offsetX + ((eyeCx + nose.x) / 2) * rw;
        const sy = offsetY + ((eyeCy + nose.y) / 2 + (nose.y - eyeCy) * 0.15) * rh;

        const ipdPx = Math.hypot(
          (rightEye.x - leftEye.x) * rw,
          (rightEye.y - leftEye.y) * rh
        );

        // Converte px -> mundo no plano z=0
        const visH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
        const visW = visH * camera.aspect;
        const worldX = (sx / cw - 0.5) * visW;
        const worldY = (0.5 - sy / ch) * visH;
        const ipdWorld = (ipdPx / cw) * visW;
        const targetScale = (ipdWorld * 2.05) / 2; // modelo tem ~2 un. de largura

        // Rotação 3D a partir da matriz de transformação facial
        const matData = result.facialTransformationMatrixes?.[0]?.data;
        if (matData) {
          tmpMat.fromArray(matData);
          tmpMat.decompose(tmpPos, tmpQuat, tmpScl);
        } else {
          tmpQuat.identity();
        }

        const sm = smoothRef.current;
        const targetPos = new THREE.Vector3(worldX, worldY, 0);
        if (!sm.init) {
          sm.pos.copy(targetPos);
          sm.quat.copy(tmpQuat);
          sm.scale = targetScale;
          sm.init = true;
        } else {
          sm.pos.lerp(targetPos, 0.35);
          sm.quat.slerp(tmpQuat, 0.35);
          sm.scale += (targetScale - sm.scale) * 0.35;
        }

        g.visible = true;
        g.position.copy(sm.pos);
        g.quaternion.copy(sm.quat);
        g.scale.setScalar(sm.scale);

        onStatus?.({ status: "stable", confidence: 95 });
        renderer.render(scene, camera);
      };
      loop();

      // cleanup específico do three
      rendererRef.current._ro = ro;
    };

    setup();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      rendererRef.current?._ro?.disconnect?.();
      try {
        landmarkerRef.current?.close?.();
      } catch {
        /* noop */
      }
      landmarkerRef.current = null;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      glassesRef.current = null;
    };
    // Recria quando o produto (modelo/forma) muda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, product?.model3dUrl, product?.shape]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-950 overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        autoPlay
        muted
        playsInline
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full scale-x-[-1]" />

      {loading && !error && (
        <div className="absolute inset-0 bg-slate-950/75 flex flex-col items-center justify-center text-white p-6 text-center">
          <span className="material-symbols-outlined text-5xl mb-3 animate-pulse">view_in_ar</span>
          <strong className="block text-base mb-1">Preparando provador 3D</strong>
          <p className="text-xs text-slate-300 max-w-xs">
            Conectando câmera e carregando o rastreador facial...
          </p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center text-white p-6 text-center">
          <span className="material-symbols-outlined text-5xl mb-3 text-error">videocam_off</span>
          <p className="text-sm max-w-xs">{error}</p>
        </div>
      )}
    </div>
  );
}
