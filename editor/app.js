const editorCanvas = document.querySelector("#editorCanvas");
const previewCanvas = document.querySelector("#previewCanvas");
const codeOutput = document.querySelector("#codeOutput");
const statusText = document.querySelector("#status");
const copyNotice = document.querySelector("#copyNotice");
const modeButtons = document.querySelector("#modeButtons");
const sizeButtons = document.querySelector("#sizeButtons");
const showGridInput = document.querySelector("#showGrid");
const varNameInput = document.querySelector("#varName");
const drawXInput = document.querySelector("#drawX");
const drawYInput = document.querySelector("#drawY");
const scaleModeInput = document.querySelector("#scaleMode");
const outputModeInput = document.querySelector("#outputMode");
const libraryModeInput = document.querySelector("#libraryMode");
const byteOrderInput = document.querySelector("#byteOrder");
const pngInput = document.querySelector("#pngInput");
const frameDelayInput = document.querySelector("#frameDelay");
const frameStrip = document.querySelector("#frameStrip");
const playPreviewButton = document.querySelector("#playPreview");
const animationControls = document.querySelector("#animationControls");

const editorCtx = editorCanvas.getContext("2d");
const previewCtx = previewCanvas.getContext("2d");

let size = 16;
let editorMode = "single";
let pixels = createPixels(size);
let frames = [{ pixels, vectorShapes: [] }];
let currentFrame = 0;
let isDrawing = false;
let dragStart = null;
let toggledCells = new Set();
let paintValue = 1;
let previewPixels = null;
let vectorShapes = [];
let undoStack = [];
let redoStack = [];
let isPlaying = false;
let playTimer = 0;
let copyNoticeTimer = 0;

function previewDelay() {
  return Math.max(20, Number.parseInt(frameDelayInput.value, 10) || 120);
}

function advancePreviewFrame() {
  currentFrame = (currentFrame + 1) % frames.length;
  syncActiveFrame();
  drawPreview();
  renderFrameStrip();
}

function restartPreviewPlayback() {
  if (playTimer) window.clearInterval(playTimer);
  playTimer = window.setInterval(advancePreviewFrame, previewDelay());
}

function showCopyNotice() {
  if (copyNoticeTimer) window.clearTimeout(copyNoticeTimer);
  copyNotice.textContent = "MakeCode JavaScriptをコピーしました";
  copyNotice.classList.add("show");
  copyNoticeTimer = window.setTimeout(() => {
    copyNotice.classList.remove("show");
    copyNotice.textContent = "";
    copyNoticeTimer = 0;
  }, 5000);
}

async function copyMakeCode() {
  try {
    await navigator.clipboard.writeText(codeOutput.value);
  } catch {
    codeOutput.focus();
    codeOutput.select();
    document.execCommand("copy");
  }
  showCopyNotice();
}

function isTypingTarget(target) {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target.isContentEditable;
}

function snapshotState() {
  return {
    size,
    editorMode,
    frames: frames.map((frame) => ({
      pixels: frame.pixels.slice(),
      vectorShapes: frame.vectorShapes.map((shape) => ({ ...shape })),
    })),
    currentFrame,
    varName: varNameInput.value,
  };
}

function restoreState(state) {
  size = state.size;
  editorMode = state.editorMode || "single";
  frames = state.frames.map((frame) => ({
    pixels: frame.pixels.slice(),
    vectorShapes: frame.vectorShapes.map((shape) => ({ ...shape })),
  }));
  currentFrame = Math.min(state.currentFrame, frames.length - 1);
  syncActiveFrame();
  previewPixels = null;
  dragStart = null;
  varNameInput.value = state.varName || `bitmap${size}`;
  setActiveButton(modeButtons, `[data-mode="${editorMode}"]`);
  setActiveButton(sizeButtons, `[data-size="${size}"]`);
  updateScaleOptions();
  render();
}

function pushHistory() {
  undoStack.push(snapshotState());
  if (undoStack.length > 80) undoStack.shift();
  redoStack = [];
}

function undo() {
  if (!undoStack.length) return;
  redoStack.push(snapshotState());
  restoreState(undoStack.pop());
}

function redo() {
  if (!redoStack.length) return;
  undoStack.push(snapshotState());
  restoreState(redoStack.pop());
}

function createPixels(nextSize) {
  return new Uint8Array(nextSize * nextSize);
}

function createFrame(sourcePixels = createPixels(size), sourceShapes = []) {
  return {
    pixels: sourcePixels.slice(),
    vectorShapes: sourceShapes.map((shape) => ({ ...shape })),
  };
}

function syncActiveFrame() {
  pixels = frames[currentFrame].pixels;
  vectorShapes = frames[currentFrame].vectorShapes;
}

function saveActiveFrame() {
  frames[currentFrame].pixels = pixels;
  frames[currentFrame].vectorShapes = vectorShapes;
}

function selectFrame(index) {
  currentFrame = Math.max(0, Math.min(frames.length - 1, index));
  syncActiveFrame();
  render();
}

function pixelIndex(x, y) {
  return y * size + x;
}

function clampName(value) {
  const cleaned = value.trim().replace(/[^a-zA-Z0-9_$]/g, "");
  if (!cleaned) return "bitmap";
  return /^[a-zA-Z_$]/.test(cleaned) ? cleaned : `bitmap${cleaned}`;
}

function setActiveButton(group, selector) {
  group.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.matches(selector));
  });
}

function setSize(nextSize) {
  const oldSize = size;
  const oldPixels = pixels;
  size = nextSize;
  pixels = createPixels(size);
  const copySize = Math.min(oldSize, size);
  for (let y = 0; y < copySize; y += 1) {
    for (let x = 0; x < copySize; x += 1) {
      pixels[pixelIndex(x, y)] = oldPixels[y * oldSize + x];
    }
  }
  vectorShapes = [];
  frames = [createFrame(pixels, vectorShapes)];
  currentFrame = 0;
  syncActiveFrame();
  varNameInput.value = `bitmap${size}`;
  setActiveButton(sizeButtons, `[data-size="${size}"]`);
  updateScaleOptions();
  render();
}

function scaleValue() {
  if (scaleModeInput.value === "fit") {
    return Math.max(1, Math.floor(128 / size));
  }
  return Number.parseInt(scaleModeInput.value, 10) || 1;
}

function outputSize() {
  return Math.min(128, size * scaleValue());
}

function outputPixel(x, y) {
  const scale = scaleValue();
  return pixels[pixelIndex(Math.floor(x / scale), Math.floor(y / scale))];
}

function updateScaleOptions() {
  scaleModeInput.querySelectorAll("option").forEach((option) => {
    if (option.value === "fit") return;
    const scale = Number.parseInt(option.value, 10);
    option.disabled = size * scale > 128;
  });
  if (scaleModeInput.selectedOptions[0]?.disabled) {
    scaleModeInput.value = "fit";
  }
}

function drawEditor() {
  const width = editorCanvas.width;
  const cell = width / size;
  const source = previewPixels || pixels;
  editorCtx.fillStyle = "#ffffff";
  editorCtx.fillRect(0, 0, width, width);

  editorCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--pixel").trim();
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (source[pixelIndex(x, y)]) {
        editorCtx.fillRect(Math.round(x * cell), Math.round(y * cell), Math.ceil(cell), Math.ceil(cell));
      }
    }
  }

  if (showGridInput.checked && size <= 64) {
    editorCtx.strokeStyle = size <= 32 ? "#d8dde7" : "#e9edf3";
    editorCtx.lineWidth = 1;
    for (let line = 0; line <= size; line += 1) {
      const p = Math.round(line * cell) + 0.5;
      editorCtx.beginPath();
      editorCtx.moveTo(p, 0);
      editorCtx.lineTo(p, width);
      editorCtx.stroke();
      editorCtx.beginPath();
      editorCtx.moveTo(0, p);
      editorCtx.lineTo(width, p);
      editorCtx.stroke();
    }
  }
}

function drawPreview() {
  if (isPlaying && frames.length > 1) {
    drawPreviewFrame(frames[currentFrame].pixels);
    return;
  }
  drawPreviewFrame(pixels);
}

function drawPreviewFrame(sourcePixels) {
  const drawX = Number.parseInt(drawXInput.value, 10) || 0;
  const drawY = Number.parseInt(drawYInput.value, 10) || 0;
  const outSize = outputSize();
  const scale = scaleValue();
  previewCtx.fillStyle = "#eefdf8";
  previewCtx.fillRect(0, 0, 128, 128);
  previewCtx.fillStyle = "#10231f";
  for (let y = 0; y < outSize; y += 1) {
    for (let x = 0; x < outSize; x += 1) {
      if (sourcePixels[pixelIndex(Math.floor(x / scale), Math.floor(y / scale))]) {
        previewCtx.fillRect(drawX + x, drawY + y, 1, 1);
      }
    }
  }
}

function renderFrameStrip() {
  frameStrip.textContent = "";
  frames.forEach((frame, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `frame-thumb${index === currentFrame ? " active" : ""}`;
    button.setAttribute("aria-label", `フレーム ${index + 1}`);
    button.dataset.frame = String(index);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const image = ctx.createImageData(size, size);
    for (let i = 0; i < frame.pixels.length; i += 1) {
      const offset = i * 4;
      const value = frame.pixels[i] ? 16 : 255;
      image.data[offset] = value;
      image.data[offset + 1] = value;
      image.data[offset + 2] = value;
      image.data[offset + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    button.append(canvas);
    frameStrip.append(button);
  });
}

function makeBitmapBytes(order = byteOrderInput.value) {
  const bytes = [];
  const outSize = outputSize();
  if (order === "column") {
    for (let x = 0; x < outSize; x += 1) {
      for (let pageY = 0; pageY < outSize; pageY += 8) {
        bytes.push(makeVerticalByte(x, pageY));
      }
    }
    return bytes;
  }

  for (let pageY = 0; pageY < outSize; pageY += 8) {
    for (let x = 0; x < outSize; x += 1) {
      bytes.push(makeVerticalByte(x, pageY));
    }
  }
  return bytes;
}

function makeSourceBitmapBytes() {
  return makeSourceBitmapBytesFor(pixels);
}

function makeSourceBitmapBytesFor(sourcePixels) {
  const bytes = [];
  for (let pageY = 0; pageY < size; pageY += 8) {
    for (let x = 0; x < size; x += 1) {
      let value = 0;
      for (let bit = 0; bit < 8; bit += 1) {
        const y = pageY + bit;
        if (y < size && sourcePixels[pixelIndex(x, y)]) {
          value |= 1 << bit;
        }
      }
      bytes.push(value);
    }
  }
  return bytes;
}

function makeSourceRuns(source = pixels) {
  const runs = [];
  for (let y = 0; y < size; y += 1) {
    let x = 0;
    while (x < size) {
      while (x < size && !source[pixelIndex(x, y)]) x += 1;
      if (x >= size) break;
      const start = x;
      while (x < size && source[pixelIndex(x, y)]) x += 1;
      runs.push({ x: start, y, width: x - start });
    }
  }
  return runs;
}

function makeScaledRuns(source = pixels) {
  const drawX = Number.parseInt(drawXInput.value, 10) || 0;
  const drawY = Number.parseInt(drawYInput.value, 10) || 0;
  const scale = scaleValue();
  return makeSourceRuns(source).map((run) => ({
    x: drawX + run.x * scale,
    y: drawY + run.y * scale,
    width: run.width * scale,
    height: scale,
  }));
}

function scaledVectorShapes() {
  const drawX = Number.parseInt(drawXInput.value, 10) || 0;
  const drawY = Number.parseInt(drawYInput.value, 10) || 0;
  const scale = scaleValue();
  return vectorShapes.map((shape) => ({
    type: shape.type,
    x1: drawX + shape.x1 * scale,
    y1: drawY + shape.y1 * scale,
    x2: drawX + (shape.x2 + 1) * scale - 1,
    y2: drawY + (shape.y2 + 1) * scale - 1,
  }));
}

function pixelsWithoutVectorShapes() {
  const source = pixels.slice();
  vectorShapes.forEach((shape) => {
    if (shape.type === "hline") {
      for (let x = shape.x1; x <= shape.x2; x += 1) setPixel(source, x, shape.y1, 0);
    } else if (shape.type === "vline") {
      for (let y = shape.y1; y <= shape.y2; y += 1) setPixel(source, shape.x1, y, 0);
    } else if (shape.type === "rect") {
      for (let x = shape.x1; x <= shape.x2; x += 1) {
        setPixel(source, x, shape.y1, 0);
        setPixel(source, x, shape.y2, 0);
      }
      for (let y = shape.y1; y <= shape.y2; y += 1) {
        setPixel(source, shape.x1, y, 0);
        setPixel(source, shape.x2, y, 0);
      }
    }
  });
  return source;
}

function extractVerticalRuns(source) {
  const working = source.slice();
  const runs = [];
  for (let x = 0; x < size; x += 1) {
    let y = 0;
    while (y < size) {
      while (y < size && !working[pixelIndex(x, y)]) y += 1;
      if (y >= size) break;
      const start = y;
      while (y < size && working[pixelIndex(x, y)]) y += 1;
      const height = y - start;
      let isolatedPixels = 0;
      for (let checkY = start; checkY < y; checkY += 1) {
        const hasLeft = x > 0 && working[pixelIndex(x - 1, checkY)];
        const hasRight = x < size - 1 && working[pixelIndex(x + 1, checkY)];
        if (!hasLeft && !hasRight) isolatedPixels += 1;
      }
      if (height >= 2 && isolatedPixels >= Math.max(1, height - 2)) {
        runs.push({ x, y: start, height });
        for (let clearY = start; clearY < y; clearY += 1) {
          setPixel(working, x, clearY, 0);
        }
      }
    }
  }
  return { runs, pixels: working };
}

function makeScaledVerticalRuns(source) {
  const drawX = Number.parseInt(drawXInput.value, 10) || 0;
  const drawY = Number.parseInt(drawYInput.value, 10) || 0;
  const scale = scaleValue();
  const extracted = extractVerticalRuns(source);
  return {
    runs: extracted.runs.map((run) => ({
      x: drawX + run.x * scale + Math.floor(scale / 2),
      y: drawY + run.y * scale,
      height: run.height * scale,
    })),
    pixels: extracted.pixels,
  };
}

function estimateHLineBytes() {
  const scale = scaleValue();
  const vectorCost = vectorShapes.reduce((total, shape) => {
    if (shape.type === "rect") return total + 40;
    if (shape.type === "vline") return total + 8;
    return total + scale * 8;
  }, 0);
  const extracted = makeScaledVerticalRuns(pixelsWithoutVectorShapes());
  const verticalCost = extracted.runs.length * 8;
  return vectorCost + verticalCost + makeScaledRuns(extracted.pixels).reduce((total, run) => {
    const dataBytesPerLine = Math.ceil((run.width + (run.x % 8)) / 8);
    const commandBytesPerLine = 6;
    return total + run.height * (dataBytesPerLine + commandBytesPerLine);
  }, 0);
}

function selectedOutputMode() {
  if (outputModeInput.value === "bitmap") return "bitmap";
  if (outputModeInput.value !== "auto") return outputModeInput.value;
  return "bitmap";
}

function makeVerticalByte(x, pageY) {
  let value = 0;
  const outSize = outputSize();
  for (let bit = 0; bit < 8; bit += 1) {
    const y = pageY + bit;
    if (y < outSize && outputPixel(x, y)) {
      value |= 1 << bit;
    }
  }
  return value;
}

function formatHex(value) {
  return `0x${value.toString(16).padStart(2, "0")}`;
}

function makeCode() {
  if (editorMode === "animation" && frames.length > 1 && libraryModeInput.value === "fast" && size === 16 && scaleModeInput.value === "fit" && outputModeInput.value === "bitmap") {
    return makeAnimation16StableCode();
  }
  if (selectedOutputMode() === "hline") return makeHLineCode();
  return makeBitmapCode();
}

function formatByteRows(bytes, indent = "  ") {
  const rows = [];
  for (let i = 0; i < bytes.length; i += 16) {
    rows.push(`${indent}${bytes.slice(i, i + 16).map(formatHex).join(", ")}`);
  }
  return rows.join(",\n");
}

function makeBitmapCode() {
  if (libraryModeInput.value === "fast" && size === 16 && scaleModeInput.value === "fit") {
    return makeBitmap16Scale8FastCode();
  }

  const bytes = makeBitmapBytes(libraryModeInput.value === "fast" ? "page" : byteOrderInput.value);
  const varName = clampName(varNameInput.value);
  const x = Number.parseInt(drawXInput.value, 10) || 0;
  const y = Number.parseInt(drawYInput.value, 10) || 0;
  const outSize = outputSize();
  const pageRow = Math.floor(y / 8);
  const pageRows = Math.ceil(outSize / 8);
  const rows = formatByteRows(bytes);

  if (libraryModeInput.value === "fast") {
    return `let oled = groveoleddisplay.createOled()

let ${varName} = [
${rows}
]

oled.drawBitmapFast(
  ${pageRow},
  ${x},
  ${pageRows},
  ${outSize},
  ${varName}
)`;
  }

  return `let oled = groveoleddisplay.createOled()
oled.clearDisplay()

let ${varName} = [
${rows}
]

oled.drawBitmap(
  ${x},
  ${y},
  ${outSize},
  ${outSize},
  ${varName}
)`;
}

function makeBitmap16Scale8FastCode() {
  const bytes = makeSourceBitmapBytes();
  const varName = clampName(varNameInput.value);
  const x = Number.parseInt(drawXInput.value, 10) || 0;
  const rows = formatByteRows(bytes);

  return `let oled = groveoleddisplay.createOled()

let ${varName} = [
${rows}
]

oled.showImage16(
  ${x},
  ${varName}
)`;
}

function makeAnimation16StableCode() {
  const varName = clampName(varNameInput.value);
  const x = Number.parseInt(drawXInput.value, 10) || 0;
  const delay = Math.max(50, Number.parseInt(frameDelayInput.value, 10) || 80);
  const frameCount = Math.min(frames.length, 4);
  const frameArrays = frames.slice(0, frameCount).map((frame, index) => {
    const bytes = makeSourceBitmapBytesFor(frame.pixels);
    return `let ${varName}_${index} = [\n${formatByteRows(bytes)}\n]`;
  });
  const frameSetup = frames.slice(0, frameCount).map((_, index) => `oled.setAnimation16Frame(
  ${index + 1},
  ${varName}_${index}
)`).join("\n\n");

  return `let oled = groveoleddisplay.createOled()

${frameArrays.join("\n\n")}

${frameSetup}

basic.forever(function () {
  oled.showRegisteredAnimation16(
    ${x},
    ${frameCount}
  )
  basic.pause(${delay})
})`;
}

function makeHLineCode() {
  const vectorLines = scaledVectorShapes().map((shape) => {
    if (shape.type === "rect") {
      return `oled.drawRec(${shape.y1}, ${shape.x1}, ${shape.y2}, ${shape.x2})`;
    }
    const width = shape.x2 - shape.x1 + 1;
    const height = shape.y2 - shape.y1 + 1;
    if (shape.type === "vline") {
      return `oled.drawVLine(${shape.y1}, ${shape.x1 + Math.floor(width / 2)}, ${height})`;
    }
    return `drawWideHLine(${shape.x1}, ${shape.y1}, ${width}, ${height})`;
  });
  const extracted = makeScaledVerticalRuns(pixelsWithoutVectorShapes());
  const verticalLines = extracted.runs.map((run) => `oled.drawVLine(${run.y}, ${run.x}, ${run.height})`);
  const runs = makeScaledRuns(extracted.pixels);
  const lines = [
    ...vectorLines,
    ...verticalLines,
    ...runs.map((run) => `drawFastBlock(${run.x}, ${run.y}, ${run.width}, ${run.height})`),
  ];
  if (!lines.length) {
    lines.push("// まだ描画ドットがありません");
  }

  return `let oled = groveoleddisplay.createOled()
oled.clearDisplay()

function drawFastBlock(x: number, y: number, width: number, height: number) {
  drawWideHLine(x, y, width, height)
}

function drawWideHLine(x: number, y: number, width: number, height: number) {
  for (let row = 0; row < height; row++) {
    oled.drawHLine(y + row, x, width)
  }
}

${lines.join("\n")}`;
}

function render() {
  syncActiveFrame();
  drawEditor();
  drawPreview();
  renderFrameStrip();
  animationControls.classList.toggle("hidden", editorMode !== "animation");
  codeOutput.value = makeCode();
  const outSize = outputSize();
  const bitmapBytes = libraryModeInput.value === "fast" && size === 16 && scaleModeInput.value === "fit"
    ? makeSourceBitmapBytes().length
    : makeBitmapBytes().length;
  const modeLabel = "bitmap";
  const shapeLabel = vectorShapes.length ? ` / 図形 ${vectorShapes.length}` : "";
  const frameLabel = editorMode === "animation" ? ` / ${frames.length} frames` : "";
  statusText.textContent = `${size} x ${size} -> ${outSize} x ${outSize}${frameLabel} / ${modeLabel}${shapeLabel} / ${bitmapBytes} bytes`;
}

function canvasPoint(event) {
  const rect = editorCanvas.getBoundingClientRect();
  const x = Math.floor(((event.clientX - rect.left) / rect.width) * size);
  const y = Math.floor(((event.clientY - rect.top) / rect.height) * size);
  return {
    x: Math.max(0, Math.min(size - 1, x)),
    y: Math.max(0, Math.min(size - 1, y)),
  };
}

function setPixel(target, x, y, value = 1) {
  if (x < 0 || x >= size || y < 0 || y >= size) return;
  target[pixelIndex(x, y)] = value;
}

function drawLineOn(target, start, end, orientation) {
  if (orientation === "hline") {
    const from = Math.min(start.x, end.x);
    const to = Math.max(start.x, end.x);
    for (let x = from; x <= to; x += 1) setPixel(target, x, start.y);
  } else {
    const from = Math.min(start.y, end.y);
    const to = Math.max(start.y, end.y);
    for (let y = from; y <= to; y += 1) setPixel(target, start.x, y);
  }
}

function drawRectOn(target, start, end) {
  const left = Math.min(start.x, end.x);
  const right = Math.max(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const bottom = Math.max(start.y, end.y);
  for (let x = left; x <= right; x += 1) {
    setPixel(target, x, top);
    setPixel(target, x, bottom);
  }
  for (let y = top; y <= bottom; y += 1) {
    setPixel(target, left, y);
    setPixel(target, right, y);
  }
}

function applyShape(start, end, commit) {
  const target = commit ? pixels : pixels.slice();
  if (tool === "hline" || tool === "vline") {
    drawLineOn(target, start, end, tool);
  } else if (tool === "rect") {
    drawRectOn(target, start, end);
  }
  if (commit) {
    if (tool === "hline") {
      vectorShapes.push({
        type: "hline",
        x1: Math.min(start.x, end.x),
        y1: start.y,
        x2: Math.max(start.x, end.x),
        y2: start.y,
      });
    } else if (tool === "vline") {
      vectorShapes.push({
        type: "vline",
        x1: start.x,
        y1: Math.min(start.y, end.y),
        x2: start.x,
        y2: Math.max(start.y, end.y),
      });
    } else if (tool === "rect") {
      vectorShapes.push({
        type: "rect",
        x1: Math.min(start.x, end.x),
        y1: Math.min(start.y, end.y),
        x2: Math.max(start.x, end.x),
        y2: Math.max(start.y, end.y),
      });
    }
    saveActiveFrame();
    previewPixels = null;
    render();
  } else {
    previewPixels = target;
    drawEditor();
  }
}

function paintAt(event) {
  const { x, y } = canvasPoint(event);
  const key = `${x},${y}`;
  if (toggledCells.has(key)) return;
  toggledCells.add(key);
  if (vectorShapes.length) vectorShapes = [];
  const index = pixelIndex(x, y);
  pixels[index] = paintValue;
  saveActiveFrame();
  render();
}

editorCanvas.addEventListener("pointerdown", (event) => {
  isDrawing = true;
  editorCanvas.setPointerCapture(event.pointerId);
  toggledCells = new Set();
  const { x, y } = canvasPoint(event);
  paintValue = pixels[pixelIndex(x, y)] ? 0 : 1;
  pushHistory();
  paintAt(event);
});

editorCanvas.addEventListener("pointermove", (event) => {
  if (!isDrawing) return;
  paintAt(event);
});

editorCanvas.addEventListener("pointerup", (event) => {
  isDrawing = false;
  dragStart = null;
  toggledCells = new Set();
  paintValue = 1;
});

editorCanvas.addEventListener("pointercancel", () => {
  isDrawing = false;
  dragStart = null;
  toggledCells = new Set();
  paintValue = 1;
  previewPixels = null;
  render();
});

sizeButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-size]");
  if (button && Number(button.dataset.size) !== size) {
    pushHistory();
    setSize(Number(button.dataset.size));
  }
});

document.querySelector("#invert").addEventListener("click", () => {
  pushHistory();
  vectorShapes = [];
  pixels = pixels.map((value) => (value ? 0 : 1));
  saveActiveFrame();
  render();
});

document.querySelector("#flipH").addEventListener("click", () => {
  pushHistory();
  vectorShapes = [];
  const next = createPixels(size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      next[pixelIndex(size - 1 - x, y)] = pixels[pixelIndex(x, y)];
    }
  }
  pixels = next;
  saveActiveFrame();
  render();
});

document.querySelector("#flipV").addEventListener("click", () => {
  pushHistory();
  vectorShapes = [];
  const next = createPixels(size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      next[pixelIndex(x, size - 1 - y)] = pixels[pixelIndex(x, y)];
    }
  }
  pixels = next;
  saveActiveFrame();
  render();
});

document.querySelector("#clear").addEventListener("click", () => {
  pushHistory();
  vectorShapes = [];
  pixels = createPixels(size);
  saveActiveFrame();
  render();
});

showGridInput.addEventListener("change", render);
varNameInput.addEventListener("input", render);
drawXInput.addEventListener("input", render);
drawYInput.addEventListener("input", render);
scaleModeInput.addEventListener("change", render);
outputModeInput.addEventListener("change", render);
libraryModeInput.addEventListener("change", render);
byteOrderInput.addEventListener("change", render);

modeButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-mode]");
  if (!button || button.dataset.mode === editorMode) return;
  pushHistory();
  editorMode = button.dataset.mode;
  if (editorMode !== "animation" && isPlaying) {
    isPlaying = false;
    playPreviewButton.textContent = "再生";
    if (playTimer) window.clearInterval(playTimer);
    playTimer = 0;
  }
  setActiveButton(modeButtons, `[data-mode="${editorMode}"]`);
  render();
});

frameStrip.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-frame]");
  if (!button) return;
  selectFrame(Number(button.dataset.frame));
});

document.querySelector("#addFrame").addEventListener("click", () => {
  pushHistory();
  frames.splice(currentFrame + 1, 0, createFrame());
  selectFrame(currentFrame + 1);
});

document.querySelector("#duplicateFrame").addEventListener("click", () => {
  pushHistory();
  frames.splice(currentFrame + 1, 0, createFrame(pixels, vectorShapes));
  selectFrame(currentFrame + 1);
});

document.querySelector("#deleteFrame").addEventListener("click", () => {
  pushHistory();
  if (frames.length <= 1) {
    vectorShapes = [];
    pixels = createPixels(size);
    saveActiveFrame();
    render();
    return;
  }
  frames.splice(currentFrame, 1);
  selectFrame(Math.min(currentFrame, frames.length - 1));
});

frameDelayInput.addEventListener("input", () => {
  render();
  if (isPlaying) restartPreviewPlayback();
});

playPreviewButton.addEventListener("click", () => {
  isPlaying = !isPlaying;
  playPreviewButton.textContent = isPlaying ? "停止" : "再生";
  if (playTimer) window.clearInterval(playTimer);
  if (!isPlaying) {
    playTimer = 0;
    render();
    return;
  }
  restartPreviewPlayback();
});

document.addEventListener("keydown", (event) => {
  const modifier = event.metaKey || event.ctrlKey;
  if (!modifier) return;
  const key = event.key.toLowerCase();
  if (key === "z" && event.shiftKey) {
    event.preventDefault();
    redo();
  } else if (key === "z") {
    event.preventDefault();
    undo();
  } else if (key === "y") {
    event.preventDefault();
    redo();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  if (isTypingTarget(event.target)) return;
  if (event.key.toLowerCase() === "c") {
    event.preventDefault();
    copyMakeCode();
  }
});

document.querySelector("#copyCode").addEventListener("click", copyMakeCode);

document.querySelector("#downloadPng").addEventListener("click", () => {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = size;
  exportCanvas.height = size;
  const ctx = exportCanvas.getContext("2d");
  const image = ctx.createImageData(size, size);
  for (let i = 0; i < pixels.length; i += 1) {
    const offset = i * 4;
    const value = pixels[i] ? 0 : 255;
    image.data[offset] = value;
    image.data[offset + 1] = value;
    image.data[offset + 2] = value;
    image.data[offset + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  const link = document.createElement("a");
  link.href = exportCanvas.toDataURL("image/png");
  link.download = `${clampName(varNameInput.value)}.png`;
  link.click();
});

pngInput.addEventListener("change", () => {
  const file = pngInput.files?.[0];
  if (!file) return;
  const image = new Image();
  image.onload = () => {
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = size;
    sourceCanvas.height = size;
    const ctx = sourceCanvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;
    const next = createPixels(size);
    for (let i = 0; i < next.length; i += 1) {
      const offset = i * 4;
      const alpha = data[offset + 3];
      const luma = 0.299 * data[offset] + 0.587 * data[offset + 1] + 0.114 * data[offset + 2];
      next[i] = alpha > 30 && luma < 128 ? 1 : 0;
    }
    pushHistory();
    pixels = next;
    vectorShapes = [];
    saveActiveFrame();
    URL.revokeObjectURL(image.src);
    pngInput.value = "";
    render();
  };
  image.src = URL.createObjectURL(file);
});

updateScaleOptions();
render();
