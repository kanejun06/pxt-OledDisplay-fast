const editorCanvas = document.querySelector("#editorCanvas");
const previewCanvas = document.querySelector("#previewCanvas");
const codeOutput = document.querySelector("#codeOutput");
const statusText = document.querySelector("#status");
const copyNotice = document.querySelector("#copyNotice");
const modeButtons = document.querySelector("#modeButtons");
const bankButtons = document.querySelector("#bankButtons");
const sizeButtons = document.querySelector("#sizeButtons");
const showGridInput = document.querySelector("#showGrid");
const varNameInput = document.querySelector("#varName");
const scaleModeInput = document.querySelector("#scaleMode");
const outputModeInput = document.querySelector("#outputMode");
const libraryModeInput = document.querySelector("#libraryMode");
const byteOrderInput = document.querySelector("#byteOrder");
const pngInput = document.querySelector("#pngInput");
const frameDelayInput = document.querySelector("#frameDelay");
const startFrameInput = document.querySelector("#startFrame");
const endFrameInput = document.querySelector("#endFrame");
const frameStrip = document.querySelector("#frameStrip");
const playPreviewButton = document.querySelector("#playPreview");
const animationControls = document.querySelector("#animationControls");

const editorCtx = editorCanvas.getContext("2d");
const previewCtx = previewCanvas.getContext("2d");
const MAX_BANKS = 4;
const MAX_FRAMES = 8;

let size = 16;
let editorMode = "animation";
let banks = Array.from({ length: MAX_BANKS }, () => createBank());
let currentBank = 0;
let frames = banks[0].frames;
let currentFrame = 0;
let pixels = frames[0].pixels;
let vectorShapes = frames[0].vectorShapes;
let isDrawing = false;
let toggledCells = new Set();
let paintValue = 1;
let undoStack = [];
let redoStack = [];
let isPlaying = false;
let playTimer = 0;
let copyNoticeTimer = 0;

function createPixels(nextSize = size) {
  return new Uint8Array(nextSize * nextSize);
}

function createFrame(sourcePixels = createPixels(), sourceShapes = []) {
  return {
    pixels: sourcePixels.slice(),
    vectorShapes: sourceShapes.map((shape) => ({ ...shape })),
  };
}

function createBank() {
  return {
    frames: [createFrame()],
    currentFrame: 0,
    startFrame: 1,
    endFrame: 1,
    delay: 120,
  };
}

function cloneBank(bank) {
  return {
    frames: bank.frames.map((frame) => createFrame(frame.pixels, frame.vectorShapes)),
    currentFrame: bank.currentFrame,
    startFrame: bank.startFrame,
    endFrame: bank.endFrame,
    delay: bank.delay,
  };
}

function activeBank() {
  return banks[currentBank];
}

function syncActiveFrame() {
  const bank = activeBank();
  frames = bank.frames;
  currentFrame = Math.max(0, Math.min(bank.currentFrame, frames.length - 1));
  bank.currentFrame = currentFrame;
  pixels = frames[currentFrame].pixels;
  vectorShapes = frames[currentFrame].vectorShapes;
}

function saveActiveFrame() {
  const bank = activeBank();
  bank.currentFrame = currentFrame;
  bank.frames[currentFrame].pixels = pixels;
  bank.frames[currentFrame].vectorShapes = vectorShapes;
}

function syncBankControls() {
  const bank = activeBank();
  startFrameInput.max = String(bank.frames.length);
  endFrameInput.max = String(bank.frames.length);
  startFrameInput.value = String(bank.startFrame);
  endFrameInput.value = String(bank.endFrame);
  frameDelayInput.value = String(bank.delay);
  setActiveButton(bankButtons, `[data-bank="${currentBank}"]`);
}

function snapshotState() {
  return {
    size,
    editorMode,
    banks: banks.map(cloneBank),
    currentBank,
    varName: varNameInput.value,
  };
}

function restoreState(state) {
  size = state.size;
  editorMode = state.editorMode;
  banks = state.banks.map(cloneBank);
  currentBank = Math.max(0, Math.min(MAX_BANKS - 1, state.currentBank));
  varNameInput.value = state.varName;
  syncActiveFrame();
  syncBankControls();
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

function stopPreview() {
  isPlaying = false;
  playPreviewButton.textContent = "再生";
  if (playTimer) window.clearInterval(playTimer);
  playTimer = 0;
}

function selectBank(index) {
  currentBank = Math.max(0, Math.min(MAX_BANKS - 1, index));
  syncActiveFrame();
  syncBankControls();
  if (isPlaying) restartPreviewPlayback(true);
  render();
}

function selectFrame(index) {
  currentFrame = Math.max(0, Math.min(frames.length - 1, index));
  activeBank().currentFrame = currentFrame;
  syncActiveFrame();
  render();
}

function setSize(nextSize) {
  const oldSize = size;
  size = nextSize;
  banks = banks.map((bank) => {
    const nextFrames = bank.frames.map((frame) => {
      const next = createPixels(size);
      const copySize = Math.min(oldSize, size);
      for (let y = 0; y < copySize; y += 1) {
        for (let x = 0; x < copySize; x += 1) {
          next[y * size + x] = frame.pixels[y * oldSize + x];
        }
      }
      return createFrame(next);
    });
    return { ...bank, frames: nextFrames };
  });
  varNameInput.value = `bitmap${size}`;
  syncActiveFrame();
  setActiveButton(sizeButtons, `[data-size="${size}"]`);
  updateScaleOptions();
  render();
}

function scaleValue() {
  if (scaleModeInput.value === "fit") return Math.max(1, Math.floor(128 / size));
  return Number.parseInt(scaleModeInput.value, 10) || 1;
}

function outputSize() {
  return Math.min(128, size * scaleValue());
}

function updateScaleOptions() {
  scaleModeInput.querySelectorAll("option").forEach((option) => {
    if (option.value === "fit") return;
    option.disabled = size * Number.parseInt(option.value, 10) > 128;
  });
  if (scaleModeInput.selectedOptions[0]?.disabled) scaleModeInput.value = "fit";
}

function drawEditor() {
  const width = editorCanvas.width;
  const cell = width / size;
  editorCtx.fillStyle = "#ffffff";
  editorCtx.fillRect(0, 0, width, width);
  editorCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--pixel").trim();
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (pixels[pixelIndex(x, y)]) {
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

function drawPreviewFrame(sourcePixels) {
  const outSize = outputSize();
  const scale = scaleValue();
  previewCtx.fillStyle = "#eefdf8";
  previewCtx.fillRect(0, 0, 128, 128);
  previewCtx.fillStyle = "#10231f";
  for (let y = 0; y < outSize; y += 1) {
    for (let x = 0; x < outSize; x += 1) {
      if (sourcePixels[pixelIndex(Math.floor(x / scale), Math.floor(y / scale))]) {
        previewCtx.fillRect(x, y, 1, 1);
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
    const number = document.createElement("span");
    number.className = "frame-number";
    number.textContent = String(index + 1);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const image = ctx.createImageData(size, size);
    for (let i = 0; i < frame.pixels.length; i += 1) {
      const value = frame.pixels[i] ? 16 : 255;
      image.data[i * 4] = value;
      image.data[i * 4 + 1] = value;
      image.data[i * 4 + 2] = value;
      image.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    button.append(canvas, number);
    frameStrip.append(button);
  });
}

function render() {
  syncActiveFrame();
  drawEditor();
  drawPreviewFrame(pixels);
  renderFrameStrip();
  syncBankControls();
  animationControls.classList.toggle("hidden", editorMode !== "animation");
  codeOutput.value = makeCode();
  const frameLabel = editorMode === "animation"
    ? ` / bank ${currentBank + 1} / ${frames.length} frames / ${activeBank().startFrame}-${activeBank().endFrame}`
    : "";
  statusText.textContent = `${size} x ${size} -> ${outputSize()} x ${outputSize()}${frameLabel} / bitmap`;
}

function previewDelay() {
  return Math.max(20, activeBank().delay);
}

function advancePreviewFrame() {
  const bank = activeBank();
  const start = bank.startFrame - 1;
  const end = bank.endFrame - 1;
  currentFrame = currentFrame < start || currentFrame >= end ? start : currentFrame + 1;
  bank.currentFrame = currentFrame;
  syncActiveFrame();
  drawEditor();
  drawPreviewFrame(pixels);
  renderFrameStrip();
}

function restartPreviewPlayback(resetFrame = false) {
  if (playTimer) window.clearInterval(playTimer);
  if (resetFrame) {
    currentFrame = activeBank().startFrame - 1;
    activeBank().currentFrame = currentFrame;
    syncActiveFrame();
    drawEditor();
    drawPreviewFrame(pixels);
    renderFrameStrip();
  }
  playTimer = window.setInterval(advancePreviewFrame, previewDelay());
}

function makeSourceBitmapBytesFor(sourcePixels) {
  const bytes = [];
  for (let pageY = 0; pageY < size; pageY += 8) {
    for (let x = 0; x < size; x += 1) {
      let value = 0;
      for (let bit = 0; bit < 8; bit += 1) {
        const y = pageY + bit;
        if (y < size && sourcePixels[pixelIndex(x, y)]) value |= 1 << bit;
      }
      bytes.push(value);
    }
  }
  return bytes;
}

function makeBitmapBytes(sourcePixels = pixels, order = byteOrderInput.value) {
  const outSize = outputSize();
  const scale = scaleValue();
  const bytes = [];
  const verticalByte = (x, pageY) => {
    let value = 0;
    for (let bit = 0; bit < 8; bit += 1) {
      const y = pageY + bit;
      if (y < outSize && sourcePixels[pixelIndex(Math.floor(x / scale), Math.floor(y / scale))]) value |= 1 << bit;
    }
    return value;
  };
  if (order === "column") {
    for (let x = 0; x < outSize; x += 1) {
      for (let pageY = 0; pageY < outSize; pageY += 8) bytes.push(verticalByte(x, pageY));
    }
  } else {
    for (let pageY = 0; pageY < outSize; pageY += 8) {
      for (let x = 0; x < outSize; x += 1) bytes.push(verticalByte(x, pageY));
    }
  }
  return bytes;
}

function formatHex(value) {
  return `0x${value.toString(16).padStart(2, "0")}`;
}

function formatByteRows(bytes, indent = "  ") {
  const rows = [];
  for (let i = 0; i < bytes.length; i += 16) {
    rows.push(`${indent}${bytes.slice(i, i + 16).map(formatHex).join(", ")}`);
  }
  return rows.join(",\n");
}

function makeSingleCode() {
  const varName = clampName(varNameInput.value);
  if (libraryModeInput.value === "fast" && size === 16 && scaleModeInput.value === "fit") {
    return `let oled = groveoleddisplay.createOled()

let ${varName} = [
${formatByteRows(makeSourceBitmapBytesFor(pixels))}
]

oled.showImage16(
  0,
  ${varName}
)`;
  }
  const bytes = makeBitmapBytes(pixels, libraryModeInput.value === "fast" ? "page" : byteOrderInput.value);
  const pageRows = Math.ceil(outputSize() / 8);
  if (libraryModeInput.value === "fast") {
    return `let oled = groveoleddisplay.createOled()

let ${varName} = [
${formatByteRows(bytes)}
]

oled.drawBitmapFast(0, 0, ${pageRows}, ${outputSize()}, ${varName})`;
  }
  return `let oled = groveoleddisplay.createOled()

let ${varName} = [
${formatByteRows(bytes)}
]

oled.drawBitmap(0, 0, ${outputSize()}, ${outputSize()}, ${varName})`;
}

function makeAnimationCode() {
  const baseName = clampName(varNameInput.value);
  const declarations = [];
  const registrations = [];
  const players = [];
  banks.forEach((bank, bankIndex) => {
    bank.frames.slice(0, MAX_FRAMES).forEach((frame, frameIndex) => {
      const name = `${baseName}_b${bankIndex + 1}_f${frameIndex + 1}`;
      declarations.push(`let ${name} = [\n${formatByteRows(makeSourceBitmapBytesFor(frame.pixels))}\n]`);
      registrations.push(`oled.setBankAnimationFrame(${bankIndex + 1}, ${frameIndex + 1}, ${name})`);
    });
    players.push(`function playBank${bankIndex + 1}() {
  oled.playBankAnimation(${bankIndex + 1}, ${bank.startFrame}, ${bank.endFrame})
  basic.pause(${bank.delay})
}`);
  });
  return `let oled = groveoleddisplay.createOled()

${declarations.join("\n\n")}

${registrations.join("\n")}

${players.join("\n\n")}

basic.forever(function () {
  playBank1()
})`;
}

function makeCode() {
  const canUseBanks = libraryModeInput.value === "fast" && size === 16 && scaleModeInput.value === "fit" && outputModeInput.value === "bitmap";
  if (editorMode === "animation" && canUseBanks) return makeAnimationCode();
  return makeSingleCode();
}

function canvasPoint(event) {
  const rect = editorCanvas.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(size - 1, Math.floor(((event.clientX - rect.left) / rect.width) * size))),
    y: Math.max(0, Math.min(size - 1, Math.floor(((event.clientY - rect.top) / rect.height) * size))),
  };
}

function paintAt(event) {
  const { x, y } = canvasPoint(event);
  const key = `${x},${y}`;
  if (toggledCells.has(key)) return;
  toggledCells.add(key);
  pixels[pixelIndex(x, y)] = paintValue;
  vectorShapes = [];
  saveActiveFrame();
  render();
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
  return target instanceof HTMLInputElement
    || target instanceof HTMLTextAreaElement
    || target instanceof HTMLSelectElement
    || target.isContentEditable;
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
  if (isDrawing) paintAt(event);
});

function endDrawing() {
  isDrawing = false;
  toggledCells = new Set();
  paintValue = 1;
}

editorCanvas.addEventListener("pointerup", endDrawing);
editorCanvas.addEventListener("pointercancel", endDrawing);

modeButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-mode]");
  if (!button || button.dataset.mode === editorMode) return;
  pushHistory();
  editorMode = button.dataset.mode;
  if (editorMode === "single") {
    stopPreview();
    currentBank = 0;
    activeBank().currentFrame = 0;
    syncActiveFrame();
  }
  setActiveButton(modeButtons, `[data-mode="${editorMode}"]`);
  render();
});

bankButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-bank]");
  if (button) selectBank(Number(button.dataset.bank));
});

sizeButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-size]");
  if (button && Number(button.dataset.size) !== size) {
    pushHistory();
    setSize(Number(button.dataset.size));
  }
});

frameStrip.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-frame]");
  if (button) selectFrame(Number(button.dataset.frame));
});

document.querySelector("#addFrame").addEventListener("click", () => {
  if (frames.length >= MAX_FRAMES) return;
  pushHistory();
  frames.splice(currentFrame + 1, 0, createFrame());
  const bank = activeBank();
  bank.endFrame = Math.min(frames.length, Math.max(bank.endFrame, currentFrame + 2));
  selectFrame(currentFrame + 1);
});

document.querySelector("#duplicateFrame").addEventListener("click", () => {
  if (frames.length >= MAX_FRAMES) return;
  pushHistory();
  frames.splice(currentFrame + 1, 0, createFrame(pixels, vectorShapes));
  const bank = activeBank();
  bank.endFrame = Math.min(frames.length, Math.max(bank.endFrame, currentFrame + 2));
  selectFrame(currentFrame + 1);
});

document.querySelector("#deleteFrame").addEventListener("click", () => {
  pushHistory();
  if (currentFrame === 0 || frames.length === 1) {
    pixels = createPixels();
    vectorShapes = [];
    saveActiveFrame();
    render();
    return;
  }
  frames.splice(currentFrame, 1);
  const bank = activeBank();
  bank.startFrame = Math.min(bank.startFrame, frames.length);
  bank.endFrame = Math.max(bank.startFrame, Math.min(bank.endFrame, frames.length));
  selectFrame(Math.min(currentFrame, frames.length - 1));
});

document.querySelector("#invert").addEventListener("click", () => {
  pushHistory();
  pixels = pixels.map((value) => (value ? 0 : 1));
  vectorShapes = [];
  saveActiveFrame();
  render();
});

document.querySelector("#flipH").addEventListener("click", () => {
  pushHistory();
  const next = createPixels();
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) next[pixelIndex(size - 1 - x, y)] = pixels[pixelIndex(x, y)];
  }
  pixels = next;
  vectorShapes = [];
  saveActiveFrame();
  render();
});

document.querySelector("#flipV").addEventListener("click", () => {
  pushHistory();
  const next = createPixels();
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) next[pixelIndex(x, size - 1 - y)] = pixels[pixelIndex(x, y)];
  }
  pixels = next;
  vectorShapes = [];
  saveActiveFrame();
  render();
});

document.querySelector("#clear").addEventListener("click", () => {
  pushHistory();
  pixels = createPixels();
  vectorShapes = [];
  saveActiveFrame();
  render();
});

startFrameInput.addEventListener("input", () => {
  const bank = activeBank();
  bank.startFrame = Math.max(1, Math.min(frames.length, Number.parseInt(startFrameInput.value, 10) || 1));
  if (bank.endFrame < bank.startFrame) bank.endFrame = bank.startFrame;
  if (isPlaying) restartPreviewPlayback(true);
  render();
});

endFrameInput.addEventListener("input", () => {
  const bank = activeBank();
  bank.endFrame = Math.max(bank.startFrame, Math.min(frames.length, Number.parseInt(endFrameInput.value, 10) || bank.startFrame));
  if (isPlaying) restartPreviewPlayback(true);
  render();
});

frameDelayInput.addEventListener("input", () => {
  activeBank().delay = Math.max(20, Number.parseInt(frameDelayInput.value, 10) || 120);
  if (isPlaying) restartPreviewPlayback();
  render();
});

playPreviewButton.addEventListener("click", () => {
  isPlaying = !isPlaying;
  playPreviewButton.textContent = isPlaying ? "停止" : "再生";
  if (isPlaying) restartPreviewPlayback(true);
  else stopPreview();
});

showGridInput.addEventListener("change", render);
varNameInput.addEventListener("input", render);
scaleModeInput.addEventListener("change", render);
outputModeInput.addEventListener("change", render);
libraryModeInput.addEventListener("change", render);
byteOrderInput.addEventListener("change", render);

document.addEventListener("keydown", (event) => {
  const modifier = event.metaKey || event.ctrlKey;
  if (modifier && event.key.toLowerCase() === "z") {
    event.preventDefault();
    event.shiftKey ? redo() : undo();
  } else if (modifier && event.key.toLowerCase() === "y") {
    event.preventDefault();
    redo();
  } else if (!modifier && !event.altKey && !event.shiftKey && !isTypingTarget(event.target) && event.key.toLowerCase() === "c") {
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
    const value = pixels[i] ? 0 : 255;
    image.data[i * 4] = value;
    image.data[i * 4 + 1] = value;
    image.data[i * 4 + 2] = value;
    image.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  const link = document.createElement("a");
  link.href = exportCanvas.toDataURL("image/png");
  link.download = `${clampName(varNameInput.value)}_b${currentBank + 1}_f${currentFrame + 1}.png`;
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
    const next = createPixels();
    for (let i = 0; i < next.length; i += 1) {
      const alpha = data[i * 4 + 3];
      const luma = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
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
syncBankControls();
render();
