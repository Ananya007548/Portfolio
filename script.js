/* =========================
   SETUP
========================= */

const canvas = document.getElementById("dustCanvas");
const ctx = canvas.getContext("2d");

const videoWrapper = document.querySelector(".video-wrapper");
const nav = document.querySelector(".nav");
const bottomText = document.getElementById("bottomText");

let hasEntered = false;
let lastX = null;
let lastY = null;

/* =========================
   CANVAS RESIZE (RETINA SAFE)
========================= */

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  drawFrost();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* =========================
   DRAW SOLID PINK + NAME
========================= */

function drawFrost() {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#e56eacff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawName();
}

function drawName() {
  ctx.save();

  const fontSize = Math.min(window.innerWidth * 0.35, 480);

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#ffffff";
  ctx.font = `italic 600 ${fontSize}px 'Playfair Display', serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText("Ananya", window.innerWidth / 2, window.innerHeight / 2);

  ctx.restore();
}

/* =========================
   NAME HIT ZONE (RESPONSIVE)
========================= */

function isOverName(x, y) {
  const fontSize = Math.min(window.innerWidth * 0.35, 480);

  const textWidth = fontSize * 1.6;
  const textHeight = fontSize * 0.45;

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  return (
    x > cx - textWidth / 2 &&
    x < cx + textWidth / 2 &&
    y > cy - textHeight / 2 &&
    y < cy + textHeight / 2
  );
}

/* =========================
   ERASE LOGIC
========================= */

function eraseSmooth(x, y) {
  if (hasEntered) return;

  const overName = isOverName(x, y);

  ctx.globalCompositeOperation = "destination-out";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = overName ? 60 : 90;

  if (lastX === null || lastY === null) {
    lastX = x;
    lastY = y;
    return;
  }

  const gradient = ctx.createRadialGradient(
    x,
    y,
    0,
    x,
    y,
    ctx.lineWidth / 2
  );

  gradient.addColorStop(0, overName ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,1)");
  gradient.addColorStop(0.55, "rgba(0,0,0,0.6)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.strokeStyle = gradient;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  lastX = x;
  lastY = y;
}

/* =========================
   INPUT HANDLERS
========================= */

// Mouse
canvas.addEventListener("mousemove", (e) => {
  eraseSmooth(e.clientX, e.clientY);
});

// Touch
canvas.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    const t = e.touches[0];
    eraseSmooth(t.clientX, t.clientY);
  },
  { passive: false }
);

canvas.addEventListener("mouseleave", () => {
  lastX = null;
  lastY = null;
});

/* =========================
   ENTER INTERACTION (SAFE)
========================= */

function enterSite() {
  if (hasEntered) return;
  hasEntered = true;

  canvas.classList.add("fade");
  videoWrapper.classList.add("clear");
  nav.classList.add("show");
  bottomText.classList.add("show");
}

document.body.addEventListener("click", enterSite);
document.body.addEventListener("touchend", enterSite, { passive: true });









