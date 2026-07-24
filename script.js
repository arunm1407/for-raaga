const wishes = [
  "May your ‘I’m almost ready’ finally become true… once. Just once.",
  "May every mirror selfie hit on the first try.",
  "May you return Divya’s room before she starts charging rent.",
  "May random snack runs never go out of style.",
  "May your laugh interrupt serious conversations forever.",
  "May your scams stay cute and victimless… except Divya’s room.",
  "May temple flower trays stay light and photos stay cute.",
  "May your phone storage survive another year of sister pics.",
  "May someone always save you the last piece of cake.",
  "May shopping trips end with joy, not ‘we’ll come back’.",
  "May your playlist carry the whole auto ride.",
  "May you win every tiny argument with that calm smile.",
  "May Sundays stay soft and a little chaotic.",
  "May Divya get her charging point back. Please.",
  "May your saree pins cooperate for once.",
  "May good news text you before the gossip does.",
  "May you nap without guilt and wake up iconic.",
  "May every birthday feel this extra (I’m committed now).",
  "May your people keep choosing the long way home with you.",
  "May 22 bring stupidly fun nights and gentle mornings.",
  "May you never stop teasing me. I can take it.",
  "May you feel, deep down, how proud I am of you.",
];

const roomReplies = {
  yes: {
    title: "WAIT. REALLY?!",
    body: "Okay okay okay — don’t joke. If this is real, Divya is packing emotional bags of joy. Room returned. Dignity restored. Birthday miracle unlocked. I love you (and my bed). 🏠💕",
  },
  share: {
    title: "Negotiation accepted… suspiciously",
    body: "Fine. Shared room. Shared charger. Shared chaos. But the good side of the bed is MINE. Initial here: ______ (Raaga, no fake signatures).",
  },
  no: {
    title: "WOW. On my birthday website?!",
    body: "You’re wishing yourself happy birthday from MY room right now, aren’t you? Okay criminal. This isn’t over. I’ll be back… with snacks… and a longer speech.",
  },
};

const wishGrid = document.getElementById("wishGrid");
wishes.forEach((text, i) => {
  const card = document.createElement("article");
  card.className = "wish-card";
  card.style.animationDelay = `${0.04 * i}s`;
  card.innerHTML = `<div class="num">${String(i + 1).padStart(2, "0")}</div><p>${text}</p>`;
  wishGrid.appendChild(card);
});

const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

const canvas = document.getElementById("sparkles");
const ctx = canvas.getContext("2d");
const colors = ["#ff8fab", "#ff6b8a", "#ffd6a8", "#fff5f8", "#ffb3c4", "#ffe066"];
const emojis = ["✨", "💖", "💕", "⭐", "💗", "🌟", "💓"];
const emojiRain = document.getElementById("emojiRain");
let particles = [];
let animating = false;

function spawnEmoji() {
  if (!emojiRain) return;
  const el = document.createElement("span");
  el.className = "float-emoji";
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  el.style.left = `${Math.random() * 100}vw`;
  el.style.fontSize = `${0.9 + Math.random() * 1.1}rem`;
  el.style.animationDuration = `${6 + Math.random() * 7}s`;
  emojiRain.appendChild(el);
  setTimeout(() => el.remove(), 14000);
}

for (let i = 0; i < 12; i++) setTimeout(spawnEmoji, i * 400);
setInterval(spawnEmoji, 700);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 90) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.8 + Math.random() * 5.5;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.8,
      life: 1,
      decay: 0.01 + Math.random() * 0.018,
      size: 2 + Math.random() * 3.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
  if (!animating) {
    animating = true;
    requestAnimationFrame(tick);
  }
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.045;
    p.life -= p.decay;
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  particles = particles.filter((p) => p.life > 0);
  if (particles.length) {
    requestAnimationFrame(tick);
  } else {
    animating = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

document.getElementById("celebrateBtn").addEventListener("click", (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 160);
  for (let i = 0; i < 18; i++) setTimeout(spawnEmoji, i * 60);
});

const roomReply = document.getElementById("roomReply");
document.querySelectorAll("#roomActions [data-reply]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-reply");
    const reply = roomReplies[key];
    if (!reply) return;

    document.querySelectorAll("#roomActions [data-reply]").forEach((b) => {
      b.classList.toggle("is-selected", b === btn);
    });

    roomReply.hidden = false;
    roomReply.innerHTML = `<p class="room-reply-title">${reply.title}</p><p>${reply.body}</p>`;
    roomReply.classList.remove("pop");
    void roomReply.offsetWidth;
    roomReply.classList.add("pop");

    const rect = btn.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, key === "yes" ? 100 : 55);
  });
});

window.addEventListener("load", () => {
  setTimeout(() => burst(window.innerWidth * 0.7, window.innerHeight * 0.4, 50), 700);
});
