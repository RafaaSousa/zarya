import React, { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Link } from "react-router-dom";
import {
  computeGlassesAlignment,
  createDefaultAlignmentState,
  getFrameTone
} from "../utils/faceAlignment";

const PRODUCTS = [
  {
    id: "aura-classic",
    name: "Aura Classic",
    price: 450,
    description: "Armação redonda em tartaruga com hastes finas.",
    detailedDescription: "A armação Aura Classic combina a elegância atemporal do design redondo com a durabilidade do acetato premium. Ideal para rostos ovais e quadrados, proporcionando um visual intelectual e sofisticado.",
    material: "Acetato",
    shape: "Redondo",
    gender: "Feminino",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM4Tsm4MeDgfaQMPpOIEZnSfutGVSXocom1cnycBQTxx4whlOkxiHXKVd4VN8Sewibz0fWmozu-lcMy01N3tfSgyugrNmaPq8Rat65aB60l4bE_itR58kcfJa2bWYg0AOhRKCJUV-Dsh5yhXU9K9XWHOUECC8nZW7bP_WsI-8DHFJBK1c1PLlsztG9z8-cxPTrmVpr4bMwVG4G_LK6Mt_BCNpcYneQ9e2BYO7grSixj8_VKUCTPaSR8Ei4KGCkHoP23AEc4PJBvOo",
    overlayImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_FOmBVPOV2qVypcXH13ml0hFntAk5uDDsuPveNqKpy7e4mWBWEk8Bw-pzCPIxirDpBHQv4KZEL02umwB-_ThMLKNApULLQXCZArdnPhwBFjSC18oicxJEoHsgZB8vn4ggNz3XPhp8AzZ_BJsmA9nqXpWfFMgw2G3SwPhxxQc7bqd2wd07Yz_45mOCpfruGVp8ik81vhawtBKYF6TJrM3hjFHIewZLiARalIhCGVLIDgn5e1OAc2NNdVyZ1i_hS7Oxou6_FgUTJ2I",
    colors: ["Tartaruga", "Preto", "Cristal"],
    colorHexes: ["#5C4033", "#000000", "#E5E4E2"],
    measurements: { aro: "50mm", ponte: "20mm", haste: "145mm" },
    isNew: false
  },
  {
    id: "lumina-cat",
    name: "Lumina Cat",
    price: 520,
    description: "Design gatinho marcante para um olhar sofisticado.",
    detailedDescription: "A Lumina Cat traz traços expressivos e marcantes em um design cat-eye clássico com detalhes metálicos refinados nas dobradiças. Feita para rostos ovais ou arredondados que buscam destaque com suavidade.",
    material: "Acetato",
    shape: "Gatinho",
    gender: "Feminino",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3LRBBxYBUjJRixSDbf7UmW-GGrSVqaF4vThw0TgK7l6slZfWhFcXXgA1MMtizzGi3t_QHcNVNHZ0u2LvhRjXDDRXgICqdONFTNefNxMegrde_FodCQvKC6lymP4bFowQ6sAJU4YlB5YQKt9JGk_YGdBWRqRFPsT_vlX6DGQ0-hXQLPvfO-bU3r_0rUNsjB0mOAQu9v_av3FmOYhD-gMp3lv6qb8co-fyC2mp3-NNEXkhofP6iwlDuZNQvDBIhDnJRFNoh9uHNDwY",
    overlayImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_FOmBVPOV2qVypcXH13ml0hFntAk5uDDsuPveNqKpy7e4mWBWEk8Bw-pzCPIxirDpBHQv4KZEL02umwB-_ThMLKNApULLQXCZArdnPhwBFjSC18oicxJEoHsgZB8vn4ggNz3XPhp8AzZ_BJsmA9nqXpWfFMgw2G3SwPhxxQc7bqd2wd07Yz_45mOCpfruGVp8ik81vhawtBKYF6TJrM3hjFHIewZLiARalIhCGVLIDgn5e1OAc2NNdVyZ1i_hS7Oxou6_FgUTJ2I", // Fallback overlay
    colors: ["Preto", "Vinho"],
    colorHexes: ["#000000", "#8B0000"],
    measurements: { aro: "52mm", ponte: "18mm", haste: "140mm" },
    isNew: false
  },
  {
    id: "vitre-minimal",
    name: "Vitre Minimal",
    price: 480,
    description: "Estrutura transparente e leve para o dia a dia.",
    detailedDescription: "Vitre Minimal é o equilíbrio perfeito entre design industrial e leveza. Sua estrutura transparente de acetato cristalizado oferece um ajuste confortável e um visual contemporâneo discreto.",
    material: "Titânio",
    shape: "Quadrado",
    gender: "Unissex",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXK5l35zZvOplUI17knjVn_8XgpET58U6IYHYzanOCl07KOjQYc37DupdfWq5yHk1g2u5Ma1WfwgSG8_WedyGyDg_BV6JMmx6sXJzzY44jAFtIBmF_aNtxrfq_oFC_nshKv4QUigHM9mYeDyqAnUj29wIrFTXWnZA-kalfVcqTfOTcYuGn1aGhLInxki5PIQW0D2Y9uly5FKttxnajup3toaosYe0Gxd_AOejuHL6n1w43uX8xTY5o2Mi-Y3dPvco2UNGFbizZ-hY",
    overlayImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_FOmBVPOV2qVypcXH13ml0hFntAk5uDDsuPveNqKpy7e4mWBWEk8Bw-pzCPIxirDpBHQv4KZEL02umwB-_ThMLKNApULLQXCZArdnPhwBFjSC18oicxJEoHsgZB8vn4ggNz3XPhp8AzZ_BJsmA9nqXpWfFMgw2G3SwPhxxQc7bqd2wd07Yz_45mOCpfruGVp8ik81vhawtBKYF6TJrM3hjFHIewZLiARalIhCGVLIDgn5e1OAc2NNdVyZ1i_hS7Oxou6_FgUTJ2I", // Fallback overlay
    colors: ["Transparente", "Cinza"],
    colorHexes: ["#E5E4E2", "#A9A9A9"],
    measurements: { aro: "51mm", ponte: "19mm", haste: "145mm" },
    isNew: true
  }
];

const FACE_LANDMARKER_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const FACE_LANDMARKER_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const RECALIBRATION_INTERVAL_MS = 100;

function createInitialSessionMetrics() {
  return {
    totalSamples: 0,
    successfulSamples: 0,
    positioningErrorSamples: 0,
    firstStableAlignmentMs: null,
    currentConfidence: 0,
    currentStatus: "idle",
    recalibrationIntervalMs: RECALIBRATION_INTERVAL_MS
  };
}

function getTrackingStatusLabel(status) {
  if (status === "stable") return "Estavel";
  if (status === "recalibrating") return "Recalibrando";
  if (status === "searching") return "Buscando rosto";
  return "Aguardando";
}

export default function Catalogo() {
  const videoRef = useRef(null);
  const videoFrameRef = useRef(null);
  const streamRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const alignmentStateRef = useRef(createDefaultAlignmentState());
  const sessionMetricsRef = useRef(createInitialSessionMetrics());
  const trackingStartedAtRef = useRef(0);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [sortOrder, setSortOrder] = useState("Lançamentos");
  
  // Try-on Modal State
  const [activeTryOnProduct, setActiveTryOnProduct] = useState(null);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [tryOnImageSource, setTryOnImageSource] = useState("model"); // "model" or "camera"
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isFaceTrackingLoading, setIsFaceTrackingLoading] = useState(false);
  const [isFaceTrackingReady, setIsFaceTrackingReady] = useState(false);
  const [alignmentState, setAlignmentState] = useState(createDefaultAlignmentState());
  const [sessionMetrics, setSessionMetrics] = useState(createInitialSessionMetrics());

  const resetTrackingState = () => {
    const initialAlignment = createDefaultAlignmentState();
    const initialMetrics = createInitialSessionMetrics();

    alignmentStateRef.current = initialAlignment;
    sessionMetricsRef.current = initialMetrics;
    trackingStartedAtRef.current = 0;

    setAlignmentState(initialAlignment);
    setSessionMetrics(initialMetrics);
  };

  const stopDetectionLoop = () => {
    if (detectionIntervalRef.current) {
      window.clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  const stopCameraStream = () => {
    stopDetectionLoop();

    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const initializeFaceLandmarker = async () => {
    if (faceLandmarkerRef.current) {
      setIsFaceTrackingReady(true);
      return true;
    }

    setIsFaceTrackingLoading(true);

    try {
      const vision = await FilesetResolver.forVisionTasks(FACE_LANDMARKER_WASM_URL);

      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: FACE_LANDMARKER_MODEL_URL
        },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: true,
        minFaceDetectionConfidence: 0.7,
        minFacePresenceConfidence: 0.7,
        minTrackingConfidence: 0.7
      });

      setIsFaceTrackingReady(true);
      return true;
    } catch (error) {
      console.error("Falha ao carregar o rastreador facial:", error);
      setCameraError("Nao foi possivel carregar o rastreador facial deste navegador.");
      setIsFaceTrackingReady(false);
      return false;
    } finally {
      setIsFaceTrackingLoading(false);
    }
  };

  const updateSessionMetrics = (nextAlignment) => {
    const previousMetrics = sessionMetricsRef.current;
    const nextMetrics = {
      ...previousMetrics,
      totalSamples: previousMetrics.totalSamples + 1,
      currentConfidence: Number((nextAlignment.confidence * 100).toFixed(1)),
      currentStatus: nextAlignment.status
    };

    if (nextAlignment.confidence >= 0.82) {
      nextMetrics.successfulSamples += 1;

      if (nextMetrics.firstStableAlignmentMs === null && trackingStartedAtRef.current) {
        nextMetrics.firstStableAlignmentMs = Math.round(performance.now() - trackingStartedAtRef.current);
      }
    } else {
      nextMetrics.positioningErrorSamples += 1;
    }

    sessionMetricsRef.current = nextMetrics;
    setSessionMetrics(nextMetrics);
  };

  const handleFaceTrackingStep = () => {
    const videoElement = videoRef.current;
    const frameElement = videoFrameRef.current;
    const faceLandmarker = faceLandmarkerRef.current;

    if (
      !videoElement ||
      !frameElement ||
      !faceLandmarker ||
      videoElement.readyState < 2 ||
      !videoElement.videoWidth ||
      !videoElement.videoHeight
    ) {
      return;
    }

    try {
      const result = faceLandmarker.detectForVideo(videoElement, performance.now());
      const landmarks = result.faceLandmarks?.[0];

      if (!landmarks?.length) {
        const nextAlignment = {
          ...createDefaultAlignmentState(),
          status: "searching"
        };

        alignmentStateRef.current = nextAlignment;
        setAlignmentState(nextAlignment);
        updateSessionMetrics(nextAlignment);
        return;
      }

      const nextAlignment = computeGlassesAlignment({
        landmarks,
        sourceWidth: videoElement.videoWidth,
        sourceHeight: videoElement.videoHeight,
        containerWidth: frameElement.clientWidth,
        containerHeight: frameElement.clientHeight,
        product: activeTryOnProduct,
        previousTransform: alignmentStateRef.current,
        mirrored: true
      });

      alignmentStateRef.current = nextAlignment;
      setAlignmentState(nextAlignment);
      updateSessionMetrics(nextAlignment);
    } catch (error) {
      console.error("Falha ao recalibrar alinhamento:", error);
      setCameraError("Nao foi possivel recalibrar o alinhamento facial em tempo real.");
      stopDetectionLoop();
    }
  };

  const startDetectionLoop = () => {
    stopDetectionLoop();
    resetTrackingState();
    trackingStartedAtRef.current = performance.now();

    detectionIntervalRef.current = window.setInterval(() => {
      handleFaceTrackingStep();
    }, RECALIBRATION_INTERVAL_MS);
  };

  const startCameraStream = async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setCameraError("Seu navegador nao suporta acesso a camera.");
      setTryOnImageSource("model");
      return;
    }

    setIsCameraLoading(true);
    setCameraError("");

    try {
      stopCameraStream();
      resetTrackingState();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const trackerReady = await initializeFaceLandmarker();

      if (!trackerReady) {
        stopCameraStream();
        setTryOnImageSource("model");
        return;
      }

      startDetectionLoop();
    } catch (error) {
      const errorName = error?.name;

      if (errorName === "NotAllowedError" || errorName === "PermissionDeniedError") {
        setCameraError("Permita o acesso a camera para usar o provador virtual.");
      } else if (errorName === "NotFoundError" || errorName === "DevicesNotFoundError") {
        setCameraError("Nenhuma camera foi encontrada neste dispositivo.");
      } else {
        setCameraError("Nao foi possivel iniciar a camera agora.");
      }

      setTryOnImageSource("model");
      stopCameraStream();
    } finally {
      setIsCameraLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedGender("");
    setSelectedShape("");
    setSelectedMaterial("");
  };

  const filteredProducts = PRODUCTS.filter((product) => {
    if (selectedGender && product.gender !== selectedGender) return false;
    if (selectedShape && product.shape !== selectedShape) return false;
    if (selectedMaterial && product.material !== selectedMaterial) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "Menor Preço") return a.price - b.price;
    if (sortOrder === "Maior Preço") return b.price - a.price;
    return 0; // Default
  });

  const openTryOnModal = (product) => {
    setActiveTryOnProduct(product);
    setActiveColorIndex(0);
    setTryOnImageSource("model");
    setCartSuccess(false);
    setCameraError("");
    resetTrackingState();
  };

  const closeTryOnModal = () => {
    stopCameraStream();
    setActiveTryOnProduct(null);
    setTryOnImageSource("model");
    setCameraError("");
    setIsCameraLoading(false);
    setCartSuccess(false);
    resetTrackingState();
  };

  const handleAddToCart = () => {
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 3000);
  };

  useEffect(() => {
    if (!activeTryOnProduct || tryOnImageSource !== "camera") {
      stopCameraStream();
      resetTrackingState();
      return undefined;
    }

    startCameraStream();

    return () => {
      stopCameraStream();
      resetTrackingState();
    };
  }, [activeTryOnProduct, tryOnImageSource]);

  useEffect(() => {
    return () => {
      stopCameraStream();
      faceLandmarkerRef.current?.close?.();
      faceLandmarkerRef.current = null;
    };
  }, []);

  const alignmentSuccessRate = sessionMetrics.totalSamples
    ? Math.round((sessionMetrics.successfulSamples / sessionMetrics.totalSamples) * 100)
    : 0;
  const positioningErrorRate = sessionMetrics.totalSamples
    ? Math.round((sessionMetrics.positioningErrorSamples / sessionMetrics.totalSamples) * 100)
    : 0;
  const dynamicOverlayStyle =
    tryOnImageSource === "camera" && alignmentState.isVisible
      ? {
          left: `${alignmentState.centerX}px`,
          top: `${alignmentState.centerY}px`,
          width: `${alignmentState.width}px`,
          height: `${alignmentState.height}px`,
          opacity: alignmentState.opacity,
          transform: `translate(-50%, -50%) rotate(${alignmentState.rotation}deg)`,
          transformOrigin: "center center"
        }
      : null;

  return (
    <div className="bg-background min-h-screen flex flex-col font-body">
      
      {/* Main Content */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 flex flex-col gap-6">
        
        {/* Page Header */}
        <header className="text-center md:text-left mb-6">
          <h1 className="font-display text-3xl md:text-4xl text-primary font-semibold mb-2">
            Catálogo &amp; Provador Virtual
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-sm md:text-base">
            Explore nossa coleção exclusiva de armações e experimente o caimento perfeito no conforto da sua casa com nossa tecnologia de provador virtual.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-6 relative">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-surface-container-lowest p-6 rounded-xl shadow-md border border-outline-variant/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-lg font-bold text-on-surface">Filtros</h2>
                <button 
                  onClick={handleClearFilters}
                  className="text-primary font-body text-xs font-semibold hover:underline"
                >
                  Limpar
                </button>
              </div>

              {/* Filter Section: Gênero */}
              <div className="mb-6 border-b border-surface-variant/30 pb-6">
                <h3 className="font-body text-xs font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">
                  Gênero
                </h3>
                <div className="space-y-3">
                  {["Feminino", "Masculino", "Unissex"].map((gender) => (
                    <label key={gender} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="gender" 
                        checked={selectedGender === gender}
                        onChange={() => setSelectedGender(gender)}
                        className="w-4 h-4 border-outline rounded text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <span className="text-on-surface font-body text-sm">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Section: Formato */}
              <div className="mb-6 border-b border-surface-variant/30 pb-6">
                <h3 className="font-body text-xs font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">
                  Formato
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Gatinho", "Redondo", "Quadrado", "Aviador"].map((shape) => (
                    <button 
                      key={shape}
                      onClick={() => setSelectedShape(selectedShape === shape ? "" : shape)}
                      className={`px-3 py-1.5 rounded-full border font-body text-xs transition-colors ${
                        selectedShape === shape
                          ? "border-primary bg-primary-container text-on-primary-container"
                          : "border-outline-variant/50 text-on-surface hover:border-primary hover:text-primary"
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Section: Material */}
              <div>
                <h3 className="font-body text-xs font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">
                  Material
                </h3>
                <div className="space-y-3">
                  {["Acetato", "Metal", "Titânio"].map((material) => (
                    <label key={material} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="material"
                        checked={selectedMaterial === material}
                        onChange={() => setSelectedMaterial(material)}
                        className="w-4 h-4 border-outline rounded text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <span className="text-on-surface font-body text-sm">{material}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6">
              <span className="text-on-surface-variant font-body text-sm">
                Exibindo {sortedProducts.length} resultados
              </span>
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant font-body text-xs font-bold uppercase tracking-wider">
                  Ordenar por:
                </span>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent border-none text-primary font-semibold text-sm focus:ring-0 cursor-pointer outline-none"
                >
                  <option>Lançamentos</option>
                  <option>Menor Preço</option>
                  <option>Maior Preço</option>
                </select>
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/40">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-2">search_off</span>
                <p className="font-body text-on-surface-variant">Nenhum óculos encontrado com estes filtros.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <article 
                    key={product.id}
                    className="bg-surface-container-lowest rounded-xl p-6 shadow-md flex flex-col group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary-container"
                  >
                    <div className="relative mb-6 h-48 flex items-center justify-center bg-surface-container rounded-lg overflow-hidden p-4">
                      <Link to={`/produto/${product.id}`} className="w-full h-full flex items-center justify-center">
                        <img 
                          alt={product.name} 
                          className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" 
                          src={product.image}
                        />
                      </Link>
                      
                      {/* Chips */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className="bg-[#F7F4EF] text-on-surface-variant px-2 py-1 rounded-full font-body text-[9px] uppercase tracking-wider shadow-sm font-semibold">
                          {product.material}
                        </span>
                      </div>
                      
                      {product.isNew && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-primary text-on-primary px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm">
                            Novo
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <Link to={`/produto/${product.id}`}>
                          <h3 className="font-display text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <span className="font-body text-base text-primary font-bold">
                          R$ {product.price}
                        </span>
                      </div>
                      
                      <p className="text-on-surface-variant text-xs mb-4 leading-relaxed">
                        {product.description}
                      </p>
                      
                      {/* Color Swatches */}
                      <div className="flex gap-2 mb-6 mt-auto">
                        {product.colorHexes.map((hex, index) => (
                          <button 
                            key={index}
                            title={product.colors[index]}
                            className={`w-5 h-5 rounded-full border border-outline/30 ring-2 ring-transparent hover:ring-primary/20 transition-all`}
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                      
                      {/* Try-on Button */}
                      <button 
                        onClick={() => openTryOnModal(product)}
                        className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary-container py-3 rounded-lg font-body text-xs font-bold uppercase hover:bg-primary hover:text-on-primary transition-colors group/btn shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[18px] group-hover/btn:scale-110 transition-transform">
                          photo_camera
                        </span>
                        Provar Virtualmente
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Virtual Try-On Modal Overlay */}
      {activeTryOnProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm transition-opacity" 
            onClick={closeTryOnModal}
          />
          
          {/* Modal Content Container */}
          <div className="relative z-10 w-full max-w-5xl bg-surface-container-lowest md:rounded-2xl shadow-2xl flex flex-col md:flex-row h-full md:h-auto max-h-[95vh] overflow-hidden m-4 border border-outline-variant/30">
            
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-surface-container-lowest/80 backdrop-blur rounded-full flex items-center justify-center text-on-surface hover:text-error transition-colors shadow-md border border-outline-variant/20" 
              onClick={closeTryOnModal}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Left: Camera/Model View */}
            <div className="w-full md:w-3/5 bg-[#F5EDDF]/40 relative flex items-center justify-center overflow-hidden min-h-[400px] md:min-h-[512px] p-6">
              
              <div
                ref={videoFrameRef}
                className="w-full h-full max-w-sm aspect-[3/4] md:max-w-md arch-mask overflow-hidden relative shadow-lg border-4 border-surface-container-lowest"
              >
                {tryOnImageSource === "model" ? (
                  <img 
                    alt="Modelo provando óculos virtualmente" 
                    className="w-full h-full object-cover object-top" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF639GPwKK-AjPcfdglH9b7IjzcMfutINa3qvW3QlGb8CDLw7qGo-uHgkS7aP1p0q3Nwnvl46QGnVXBOXZU8XmVw87hJroNvHRf1Kj09Cfbeg69sqotUVWwUlHk-97F0oDMTTusYuGbMyqjCNbjh56rmSsdxieKDLVk3-kj3EhfVU8VrUkZlHbFwHFkjbSbNQkbJjcf6sVmYSm8_sAph16rSOpImGaamtkqy6ldMA6Iu4YhbWC8tNSc_CZC-YpWXvBm1ymFMoElRA"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-950 relative">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover object-center scale-x-[-1]"
                      autoPlay
                      muted
                      playsInline
                    />

                    {(isCameraLoading || isFaceTrackingLoading) && (
                      <div className="absolute inset-0 bg-slate-950/75 flex flex-col items-center justify-center text-white p-6 text-center">
                        <span className="material-symbols-outlined text-5xl mb-4 animate-pulse">videocam</span>
                        <strong className="block text-base mb-1">
                          {isFaceTrackingLoading ? "Carregando rastreador facial" : "Iniciando camera"}
                        </strong>
                        <p className="text-xs text-slate-300 max-w-xs">
                          Aguarde alguns segundos enquanto conectamos a webcam e calibramos o rosto.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {tryOnImageSource === "camera" ? (
                  <div className="absolute inset-0 pointer-events-none">
                    {dynamicOverlayStyle && (
                      <div className="absolute transition-all duration-100 ease-out" style={dynamicOverlayStyle}>
                        <img
                          alt="Glasses Overlay"
                          className="w-full h-full object-contain mix-blend-multiply drop-shadow-lg"
                          style={{
                            filter: getFrameTone(
                              activeTryOnProduct.colorHexes[activeColorIndex],
                              activeColorIndex
                            )
                          }}
                          src={activeTryOnProduct.overlayImage}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-[-10%] transition-all duration-300">
                    <img
                      alt="Glasses Overlay"
                      className="w-[62%] opacity-95 drop-shadow-lg mix-blend-multiply"
                      style={{
                        filter: getFrameTone(
                          activeTryOnProduct.colorHexes[activeColorIndex],
                          activeColorIndex
                        )
                      }}
                      src={activeTryOnProduct.overlayImage}
                    />
                  </div>
                )}

                {/* Scanning Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-container/20 to-transparent w-full h-1/3 scan-animation mix-blend-overlay"></div>
              </div>

              {cameraError && (
                <div className="absolute top-6 left-6 right-6 z-10 bg-error/90 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg">
                  {cameraError}
                </div>
              )}

              {/* Camera Controls */}
              <div className="absolute bottom-8 flex gap-4 glass-panel p-3 rounded-full shadow-lg border border-white/40">
                <button 
                  onClick={() => setTryOnImageSource("model")}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${
                    tryOnImageSource === "model" ? "bg-primary text-on-primary" : "bg-surface-container-lowest text-primary hover:bg-primary/10"
                  }`}
                  title="Usar Modelo Padrão"
                >
                  <span className="material-symbols-outlined">face</span>
                </button>
                <button 
                  onClick={() => setTryOnImageSource("camera")}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md relative ${
                    tryOnImageSource === "camera" ? "bg-primary text-on-primary" : "bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary"
                  }`}
                  title="Usar Minha Câmera"
                >
                  <span className="material-symbols-outlined">photo_camera</span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full animate-pulse"></span>
                </button>
              </div>

              {tryOnImageSource === "camera" && (
                <div className="absolute top-6 left-6 z-10 bg-slate-950/75 text-white text-[11px] px-4 py-3 rounded-xl border border-white/10 shadow-lg backdrop-blur">
                  <p className="font-bold uppercase tracking-wider mb-1">
                    {getTrackingStatusLabel(sessionMetrics.currentStatus)}
                  </p>
                  <p>Recalibracao automatica a cada {RECALIBRATION_INTERVAL_MS}ms</p>
                  <p>Confiança atual: {sessionMetrics.currentConfidence}%</p>
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
                    Provando Agora
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl text-on-surface font-bold">
                    {activeTryOnProduct.name}
                  </h2>
                  <p className="font-body text-xl font-bold text-on-surface-variant mt-1">
                    R$ {activeTryOnProduct.price}
                  </p>
                </div>
                
                <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-6">
                  {activeTryOnProduct.detailedDescription}
                </p>

                <div className="mb-6">
                  <h4 className="font-body text-xs font-bold text-on-surface mb-3 uppercase tracking-wider">
                    Cores Disponíveis
                  </h4>
                  <div className="flex gap-4">
                    {activeTryOnProduct.colors.map((color, index) => (
                      <button 
                        key={color}
                        onClick={() => setActiveColorIndex(index)}
                        className="group relative flex flex-col items-center gap-1 focus:outline-none"
                      >
                        <div 
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            activeColorIndex === index 
                              ? "border-primary ring-2 ring-primary/20" 
                              : "border-transparent hover:border-outline-variant"
                          }`}
                          style={{ backgroundColor: activeTryOnProduct.colorHexes[index] }}
                        />
                        <span className={`text-[10px] font-semibold ${
                          activeColorIndex === index ? "text-primary" : "text-on-surface-variant"
                        }`}>
                          {color}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-body text-xs font-bold text-on-surface mb-3 uppercase tracking-wider">
                    Medidas
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center bg-[#F7F4EF]/50 p-3 rounded-lg border border-surface-variant/40">
                    <div>
                      <span className="material-symbols-outlined text-primary mb-1 text-[20px]">width_normal</span>
                      <p className="text-[10px] text-on-surface-variant font-bold">Aro</p>
                      <p className="font-bold text-xs text-on-surface">{activeTryOnProduct.measurements.aro}</p>
                    </div>
                    <div className="border-l border-r border-surface-variant/30">
                      <span className="material-symbols-outlined text-primary mb-1 text-[20px]">straighten</span>
                      <p className="text-[10px] text-on-surface-variant font-bold">Ponte</p>
                      <p className="font-bold text-xs text-on-surface">{activeTryOnProduct.measurements.ponte}</p>
                    </div>
                    <div>
                      <span className="material-symbols-outlined text-primary mb-1 text-[20px]">line_weight</span>
                      <p className="text-[10px] text-on-surface-variant font-bold">Haste</p>
                      <p className="font-bold text-xs text-on-surface">{activeTryOnProduct.measurements.haste}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-body text-xs font-bold text-on-surface mb-3 uppercase tracking-wider">
                    Alinhamento Automático
                  </h4>
                  <div className="bg-[#F7F4EF]/50 p-4 rounded-lg border border-surface-variant/40 space-y-3">
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      O provador mede órbitas oculares, ponte do nariz, laterais do rosto e linha da mandíbula
                      para recalibrar posição, escala e rotação da armação em tempo real.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-surface-container-lowest rounded-lg p-3 border border-outline-variant/20">
                        <p className="text-on-surface-variant uppercase tracking-wider font-bold mb-1">
                          Status
                        </p>
                        <p className="font-bold text-on-surface">
                          {getTrackingStatusLabel(sessionMetrics.currentStatus)}
                        </p>
                      </div>
                      <div className="bg-surface-container-lowest rounded-lg p-3 border border-outline-variant/20">
                        <p className="text-on-surface-variant uppercase tracking-wider font-bold mb-1">
                          Rastreio
                        </p>
                        <p className="font-bold text-on-surface">
                          {isFaceTrackingReady ? "Landmarks ativos" : "Modo de espera"}
                        </p>
                      </div>
                      <div className="bg-surface-container-lowest rounded-lg p-3 border border-outline-variant/20">
                        <p className="text-on-surface-variant uppercase tracking-wider font-bold mb-1">
                          Distância Pupilar
                        </p>
                        <p className="font-bold text-on-surface">
                          {alignmentState.interpupillaryDistance
                            ? `${Math.round(alignmentState.interpupillaryDistance)} px`
                            : "--"}
                        </p>
                      </div>
                      <div className="bg-surface-container-lowest rounded-lg p-3 border border-outline-variant/20">
                        <p className="text-on-surface-variant uppercase tracking-wider font-bold mb-1">
                          Rotação
                        </p>
                        <p className="font-bold text-on-surface">
                          {alignmentState.isVisible ? `${alignmentState.rotation.toFixed(1)}°` : "--"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-body text-xs font-bold text-on-surface mb-3 uppercase tracking-wider">
                    Métricas da Sessão
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center bg-[#F7F4EF]/50 p-3 rounded-lg border border-surface-variant/40">
                    <div>
                      <span className="material-symbols-outlined text-primary mb-1 text-[20px]">check_circle</span>
                      <p className="text-[10px] text-on-surface-variant font-bold">Sucesso</p>
                      <p className="font-bold text-xs text-on-surface">{alignmentSuccessRate}%</p>
                    </div>
                    <div className="border-l border-r border-surface-variant/30">
                      <span className="material-symbols-outlined text-primary mb-1 text-[20px]">timer</span>
                      <p className="text-[10px] text-on-surface-variant font-bold">1º Acerto</p>
                      <p className="font-bold text-xs text-on-surface">
                        {sessionMetrics.firstStableAlignmentMs !== null
                          ? `${sessionMetrics.firstStableAlignmentMs}ms`
                          : "--"}
                      </p>
                    </div>
                    <div>
                      <span className="material-symbols-outlined text-primary mb-1 text-[20px]">warning</span>
                      <p className="text-[10px] text-on-surface-variant font-bold">Erros</p>
                      <p className="font-bold text-xs text-on-surface">{positioningErrorRate}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                {cartSuccess ? (
                  <div className="bg-[#D4AF37]/20 border border-[#D4AF37] text-on-surface text-center py-3 rounded-lg text-xs font-bold uppercase transition-all duration-300">
                    Adicionado ao Carrinho!
                  </div>
                ) : (
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-primary-container text-on-primary-container py-4 rounded-lg font-body text-xs font-bold uppercase hover:bg-primary hover:text-on-primary transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">shopping_bag</span>
                    Adicionar ao Carrinho
                  </button>
                )}
                <button className="w-full bg-transparent border border-primary text-primary py-4 rounded-lg font-body text-xs font-bold uppercase hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">favorite_border</span>
                  Salvar aos Favoritos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
