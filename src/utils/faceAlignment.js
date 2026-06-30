const LANDMARK_GROUPS = {
  leftEye: [33, 133, 159, 145],
  rightEye: [263, 362, 386, 374],
  noseBridge: [168, 6],
  noseTip: [1, 4],
  leftTemple: [127, 234],
  rightTemple: [356, 454],
  leftJaw: [172, 234],
  rightJaw: [397, 454],
  chin: [152]
};

const SHAPE_FACTORS = {
  Gatinho: { width: 1.08, height: 0.42, yOffset: -0.03 },
  Redondo: { width: 1.0, height: 0.44, yOffset: 0 },
  Quadrado: { width: 1.03, height: 0.41, yOffset: -0.01 },
  Aviador: { width: 1.12, height: 0.46, yOffset: 0.02 },
  default: { width: 1.0, height: 0.43, yOffset: 0 }
};

function averagePoint(points) {
  const total = points.reduce(
    (accumulator, point) => ({
      x: accumulator.x + point.x,
      y: accumulator.y + point.y,
      z: accumulator.z + (point.z ?? 0)
    }),
    { x: 0, y: 0, z: 0 }
  );

  return {
    x: total.x / points.length,
    y: total.y / points.length,
    z: total.z / points.length
  };
}

function getVideoLayout(sourceWidth, sourceHeight, containerWidth, containerHeight) {
  const scale = Math.max(containerWidth / sourceWidth, containerHeight / sourceHeight);
  const renderedWidth = sourceWidth * scale;
  const renderedHeight = sourceHeight * scale;

  return {
    renderedWidth,
    renderedHeight,
    offsetX: (containerWidth - renderedWidth) / 2,
    offsetY: (containerHeight - renderedHeight) / 2
  };
}

function getPoints(
  landmarks,
  indices,
  sourceWidth,
  sourceHeight,
  containerWidth,
  containerHeight,
  mirrored
) {
  const { renderedWidth, renderedHeight, offsetX, offsetY } = getVideoLayout(
    sourceWidth,
    sourceHeight,
    containerWidth,
    containerHeight
  );

  return indices.map((index) => {
    const point = landmarks[index];

    return {
      x: mirrored
        ? offsetX + (1 - point.x) * renderedWidth
        : offsetX + point.x * renderedWidth,
      y: offsetY + point.y * renderedHeight,
      z: point.z ?? 0
    };
  });
}

function distance(pointA, pointB) {
  return Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function parseMillimeters(value) {
  const parsed = Number.parseFloat(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function estimateFrameWidth(measurements) {
  const lensWidth = parseMillimeters(measurements?.aro);
  const bridgeWidth = parseMillimeters(measurements?.ponte);

  if (!lensWidth || !bridgeWidth) {
    return 135;
  }

  return lensWidth * 2.18 + bridgeWidth;
}

function smoothTransform(previousTransform, nextTransform) {
  if (!previousTransform?.isVisible) {
    return nextTransform;
  }

  const smoothing = nextTransform.confidence >= 0.88 ? 0.2 : 0.3;

  return {
    ...nextTransform,
    centerX: lerp(previousTransform.centerX, nextTransform.centerX, smoothing),
    centerY: lerp(previousTransform.centerY, nextTransform.centerY, smoothing),
    width: lerp(previousTransform.width, nextTransform.width, smoothing),
    height: lerp(previousTransform.height, nextTransform.height, smoothing),
    rotation: lerp(previousTransform.rotation, nextTransform.rotation, smoothing),
    opacity: lerp(previousTransform.opacity, nextTransform.opacity, 0.35)
  };
}

export function createDefaultAlignmentState() {
  return {
    centerX: 0,
    centerY: 0,
    width: 0,
    height: 0,
    rotation: 0,
    opacity: 0,
    confidence: 0,
    faceWidth: 0,
    jawWidth: 0,
    interpupillaryDistance: 0,
    earLineY: 0,
    status: "idle",
    isVisible: false
  };
}

export function computeGlassesAlignment({
  landmarks,
  sourceWidth,
  sourceHeight,
  containerWidth,
  containerHeight,
  product,
  previousTransform,
  mirrored = true
}) {
  if (!landmarks?.length || !sourceWidth || !sourceHeight || !containerWidth || !containerHeight) {
    return {
      ...createDefaultAlignmentState(),
      status: "searching"
    };
  }

  const leftEye = averagePoint(
    getPoints(
      landmarks,
      LANDMARK_GROUPS.leftEye,
      sourceWidth,
      sourceHeight,
      containerWidth,
      containerHeight,
      mirrored
    )
  );
  const rightEye = averagePoint(
    getPoints(
      landmarks,
      LANDMARK_GROUPS.rightEye,
      sourceWidth,
      sourceHeight,
      containerWidth,
      containerHeight,
      mirrored
    )
  );
  const noseBridge = averagePoint(
    getPoints(
      landmarks,
      LANDMARK_GROUPS.noseBridge,
      sourceWidth,
      sourceHeight,
      containerWidth,
      containerHeight,
      mirrored
    )
  );
  const noseTip = averagePoint(
    getPoints(
      landmarks,
      LANDMARK_GROUPS.noseTip,
      sourceWidth,
      sourceHeight,
      containerWidth,
      containerHeight,
      mirrored
    )
  );
  const leftTemple = averagePoint(
    getPoints(
      landmarks,
      LANDMARK_GROUPS.leftTemple,
      sourceWidth,
      sourceHeight,
      containerWidth,
      containerHeight,
      mirrored
    )
  );
  const rightTemple = averagePoint(
    getPoints(
      landmarks,
      LANDMARK_GROUPS.rightTemple,
      sourceWidth,
      sourceHeight,
      containerWidth,
      containerHeight,
      mirrored
    )
  );
  const leftJaw = averagePoint(
    getPoints(
      landmarks,
      LANDMARK_GROUPS.leftJaw,
      sourceWidth,
      sourceHeight,
      containerWidth,
      containerHeight,
      mirrored
    )
  );
  const rightJaw = averagePoint(
    getPoints(
      landmarks,
      LANDMARK_GROUPS.rightJaw,
      sourceWidth,
      sourceHeight,
      containerWidth,
      containerHeight,
      mirrored
    )
  );
  const chin = averagePoint(
    getPoints(
      landmarks,
      LANDMARK_GROUPS.chin,
      sourceWidth,
      sourceHeight,
      containerWidth,
      containerHeight,
      mirrored
    )
  );

  const eyeCenter = {
    x: (leftEye.x + rightEye.x) / 2,
    y: (leftEye.y + rightEye.y) / 2
  };
  const interpupillaryDistance = distance(leftEye, rightEye);
  const faceWidth = distance(leftTemple, rightTemple);
  const jawWidth = distance(leftJaw, rightJaw);
  const earLineY = (leftTemple.y + rightTemple.y) / 2;
  const chinDistance = chin.y - eyeCenter.y;
  const headTiltRadians = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
  const headTiltDegrees = (headTiltRadians * 180) / Math.PI;
  const noseDrop = Math.max(noseTip.y - noseBridge.y, 1);

  const frameWidthMm = estimateFrameWidth(product?.measurements);
  const standardizedWidthFactor = clamp(frameWidthMm / 135, 0.84, 1.18);
  const shapeFactor = SHAPE_FACTORS[product?.shape] ?? SHAPE_FACTORS.default;

  // Ajustes finos opcionais por produto (cadastrados no admin em overlay_meta).
  const meta = product?.overlayMeta || {};
  const metaWidthScale = Number.isFinite(meta.widthScale) ? meta.widthScale : 1;
  const metaYOffset = Number.isFinite(meta.yOffset) ? meta.yOffset : 0;

  const dynamicWidth =
    Math.max(interpupillaryDistance * 2.18, faceWidth * 0.72, jawWidth * 0.68) *
    standardizedWidthFactor *
    shapeFactor.width *
    metaWidthScale;

  const width = clamp(dynamicWidth, containerWidth * 0.28, containerWidth * 0.88);
  const height = clamp(
    width * shapeFactor.height + chinDistance * 0.04,
    containerHeight * 0.12,
    containerHeight * 0.42
  );

  const centerX = eyeCenter.x + (noseBridge.x - eyeCenter.x) * 0.22;
  const centerY =
    eyeCenter.y +
    noseDrop * 0.28 +
    (earLineY - eyeCenter.y) * 0.1 +
    height * (shapeFactor.yOffset + metaYOffset);

  const faceCoverage = clamp(faceWidth / containerWidth, 0, 1);
  const facialSymmetry = 1 - clamp(Math.abs(leftEye.y - rightEye.y) / Math.max(interpupillaryDistance, 1), 0, 1);
  const jawCoverage = clamp(jawWidth / Math.max(faceWidth, 1), 0.55, 1.2);
  const confidence = clamp(
    0.45 * facialSymmetry + 0.35 * faceCoverage + 0.2 * Math.min(jawCoverage, 1),
    0,
    0.99
  );

  const computedTransform = {
    centerX,
    centerY,
    width,
    height,
    rotation: headTiltDegrees,
    opacity: confidence >= 0.65 ? 0.94 : 0.72,
    confidence,
    faceWidth,
    jawWidth,
    interpupillaryDistance,
    earLineY,
    status: confidence >= 0.82 ? "stable" : "recalibrating",
    isVisible: true
  };

  return smoothTransform(previousTransform, computedTransform);
}

export function getFrameTone(colorHex, activeColorIndex) {
  if (!activeColorIndex) {
    return "none";
  }

  return `drop-shadow(0 0 8px ${colorHex})`;
}
