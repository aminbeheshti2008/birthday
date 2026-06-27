const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");
const openLetterBtn = document.getElementById("openLetterBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalBackdrop = document.getElementById("modalBackdrop");
const letterModal = document.getElementById("letterModal");
const revealEls = document.querySelectorAll(".reveal");
const typedText = document.getElementById("typedText");
const heartsWrap = document.querySelector(".floating-hearts");
const balloonsWrap = document.querySelector(".balloons");
const confettiBtn = document.getElementById("confettiBtn");
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

const recipientNameEl = document.getElementById("recipientName");
const giftMessageEl = document.getElementById("giftMessage");
const giftAvailable = document.getElementById("giftAvailable");
const giftTakenBox = document.getElementById("giftTakenBox");
const takeGiftBtn = document.getElementById("takeGiftBtn");
const giftEnvelope = document.getElementById("giftEnvelope");

let isPlaying = false;

/* ===== config ===== */
async function loadConfig() {
  try {
    const res = await fetch("./config.json?t=" + Date.now());
    const config = await res.json();

    if (config.recipientName) {
      recipientNameEl.textContent = config.recipientName;
    }

    if (config.giftMessage) {
      giftMessageEl.textContent = config.giftMessage;
    }

    if (config.giftEnabled && !config.giftTaken) {
      giftAvailable.classList.remove("hidden");
      giftTakenBox.classList.add("hidden");
    } else {
      giftAvailable.classList.add("hidden");
      giftTakenBox.classList.remove("hidden");
    }
  } catch (e) {
    console.error("config load error", e);
  }
}
loadConfig();

/* ===== music ===== */
musicBtn.addEventListener("click", async () => {
  try {
    if (!isPlaying) {
      await bgMusic.play();
      musicBtn.textContent = "توقف آهنگ 🛑";
      isPlaying = true;
    } else {
      bgMusic.pause();
      musicBtn.textContent = "پخش آهنگ 🎶";
      isPlaying = false;
    }
  } catch (e) {
    alert("برای پخش موزیک یه بار روی صفحه تعامل کن 💖");
  }
});

/* ===== modal ===== */
function openModal() {
  letterModal.classList.remove("hidden");
}
function closeModal() {
  letterModal.classList.add("hidden");
}
openLetterBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

/* ===== reveal on scroll ===== */
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el) => io.observe(el));

/* ===== typewriter ===== */
const message =
  "یه گوشه از دلم می‌خواست امروز برات یک چیز متفاوت بسازم؛ چیزی که هرجاش بگه چقدر برام عزیزی، چقدر بودنت قشنگه، و چقدر آرزو می‌کنم امسال برات پر از خنده، آرامش و اتفاق‌های خوب باشه 💕";

let typeIndex = 0;
function typeWriter() {
  if (typeIndex < message.length) {
    typedText.textContent += message.charAt(typeIndex);
    typeIndex++;
    setTimeout(typeWriter, 42);
  }
}
window.addEventListener("load", typeWriter);

/* ===== hearts ===== */
function createHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = "❤";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = 14 + Math.random() * 18 + "px";
  heart.style.animationDuration = 4 + Math.random() * 4 + "s";
  heartsWrap.appendChild(heart);

  setTimeout(() => heart.remove(), 8000);
}
setInterval(createHeart, 550);

/* ===== balloons ===== */
const balloonColors = ["pink", "soft", "gold"];
function createBalloon() {
  const balloon = document.createElement("div");
  balloon.className = "balloon " + balloonColors[Math.floor(Math.random() * balloonColors.length)];
  balloon.style.left = Math.random() * 100 + "vw";
  balloon.style.animationDuration = 8 + Math.random() * 6 + "s";
  balloon.style.opacity = 0.75 + Math.random() * 0.25;
  balloonsWrap.appendChild(balloon);

  setTimeout(() => balloon.remove(), 15000);
}
setInterval(createBalloon, 1200);

/* ===== gift ===== */
giftEnvelope?.addEventListener("click", () => {
  giftEnvelope.classList.toggle("open");
});

takeGiftBtn?.addEventListener("click", () => {
  giftEnvelope.classList.add("open");
  launchConfetti(220);
  setTimeout(() => {
    alert("حیحیحیحیحیححیحی نمیگمممم توش چیههههه پیویم باید پیاممم بدیی تا بگمممممم💫");
  }, 300);
});

/* ===== confetti ===== */
let pieces = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function makePiece() {
  return {
    x: Math.random() * canvas.width,
    y: -20,
    w: 6 + Math.random() * 8,
    h: 10 + Math.random() * 12,
    speedY: 2 + Math.random() * 4,
    speedX: -2 + Math.random() * 4,
    rotation: Math.random() * 360,
    rotateSpeed: -8 + Math.random() * 16,
    color: ["#ff4f8b", "#ffd166", "#ffffff", "#ff94b6", "#ffc2d6"][
      Math.floor(Math.random() * 5)
    ]
  };
}

function launchConfetti(count = 160) {
  for (let i = 0; i < count; i++) {
    pieces.push(makePiece());
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pieces.forEach((p) => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotateSpeed;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });

  pieces = pieces.filter((p) => p.y < canvas.height + 30);
  requestAnimationFrame(drawConfetti);
}
drawConfetti();

confettiBtn.addEventListener("click", () => launchConfetti(220));
window.addEventListener("load", () => setTimeout(() => launchConfetti(160), 600));
