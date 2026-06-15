const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function hydrate() {
  $("#yourName").textContent    = CONFIG.yourName;
  $("#partnerName").textContent = CONFIG.partnerName;
  $("#finaleTitle").textContent   = CONFIG.finale.title;
  $("#finaleMessage").textContent = CONFIG.finale.message;
  $("#finaleSign").textContent    = CONFIG.finale.signAs;

  // reasons
  const wrap = $("#reasons");
  wrap.innerHTML = CONFIG.reasons.map((r, i) => `
    <article class="reason" data-reveal>
      <div class="reason__num">${String(i + 1).padStart(2, "0")}</div>
      <div class="reason__body">
        <h2 class="reason__title">${escapeHtml(r.title)}</h2>
        <p class="reason__text">${escapeHtml(r.body)}</p>
      </div>
    </article>
  `).join("");

  // cards
  const grid = $("#cardGrid");
  grid.innerHTML = CONFIG.cards.map((text, i) => `
    <button class="card" data-reveal style="--d:${(i % 4) * 0.08}s" aria-label="Reveal a secret">
      <div class="card__inner">
        <div class="card__face card__front">♡</div>
        <div class="card__face card__back">${escapeHtml(text)}</div>
      </div>
    </button>
  `).join("");

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) {
      card.classList.toggle("is-open");
      if (card.classList.contains("is-open")) burstHearts(e.clientX, e.clientY);
    }
  });
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function startCounter() {
  const { year, month, day } = CONFIG.anniversary;
  const start = new Date(year, month - 1, day);
  const el = $("#counter");

  const units = [
    { label: "days",    f: (d) => Math.floor(d / 86400) },
    { label: "hours",   f: (d) => Math.floor(d / 3600) % 24 },
    { label: "minutes", f: (d) => Math.floor(d / 60) % 60 },
    { label: "seconds", f: (d) => Math.floor(d) % 60 },
  ];

  el.innerHTML = units.map(u => `
    <div class="counter__unit">
      <div class="counter__num" data-unit="${u.label}">0</div>
      <div class="counter__label">${u.label}</div>
    </div>`).join("");

  const tick = () => {
    const secs = (Date.now() - start.getTime()) / 1000;
    if (secs < 0) return;
    units.forEach(u => {
      $(`[data-unit="${u.label}"]`, el).textContent =
        u.f(secs).toLocaleString();
    });
  };
  tick();
  setInterval(tick, 1000);
}

function setupReveals() {
  const items = $$("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
  items.forEach(el => io.observe(el));
}

function setupScrollCue() {
  $$("[data-scroll-to]").forEach(btn => {
    btn.addEventListener("click", () => {
      $(btn.dataset.scrollTo)?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  });
}

function heartsBackground() {
  const canvas = $("#heartsCanvas");
  const ctx = canvas.getContext("2d");
  let w, h, hearts, raf;

  const resize = () => {
    w = canvas.width  = canvas.offsetWidth  * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  };

  const make = () => ({
    x: Math.random() * w,
    y: h + Math.random() * h,
    s: (8 + Math.random() * 16) * devicePixelRatio,
    v: (0.3 + Math.random() * 0.7) * devicePixelRatio,
    sway: Math.random() * Math.PI * 2,
    swayR: (0.4 + Math.random() * 0.8) * devicePixelRatio,
    a: 0.18 + Math.random() * 0.4,
  });

  const drawHeart = (x, y, s, a, color = "#e76f8e") => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s / 16, s / 16);
    ctx.globalAlpha = a;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(-8, -4, -8, -12, 0, -8);
    ctx.bezierCurveTo(8, -12, 8, -4, 0, 4);
    ctx.fill();
    ctx.restore();
  };

  const loop = () => {
    ctx.clearRect(0, 0, w, h);
    hearts.forEach(p => {
      p.y -= p.v;
      p.sway += 0.01;
      const x = p.x + Math.sin(p.sway) * p.swayR * 12;
      drawHeart(x, p.y, p.s, p.a, p.color);
      if (p.y < -20) Object.assign(p, make(), { y: h + 20 });
    });
    raf = requestAnimationFrame(loop);
  };

  resize();
  hearts = Array.from({ length: reduceMotion ? 14 : 30 }, () => {
    const p = make();
    p.y = Math.random() * h; // start spread out
    return p;
  });
  // freeze colors per-heart so they don't flicker
  hearts.forEach(p => { p.color = Math.random() < 0.5 ? "#ff9eb1" : "#e76f8e"; });

  if (reduceMotion) {
    // single static frame
    ctx.clearRect(0, 0, w, h);
    hearts.forEach(p => drawHeart(p.x, p.y, p.s, p.a, p.color));
  } else {
    loop();
  }
  window.addEventListener("resize", () => { cancelAnimationFrame(raf); resize(); if (!reduceMotion) loop(); });
}

/* small heart burst when a card opens */
function burstHearts(x, y) {
  if (reduceMotion) return;
  for (let i = 0; i < 10; i++) {
    const el = document.createElement("div");
    el.textContent = "♡";
    el.style.cssText = `
      position:fixed; left:${x}px; top:${y}px; z-index:60; pointer-events:none;
      color:#e76f8e; font-size:${12 + Math.random() * 14}px;
      transition: transform 1s cubic-bezier(.22,1,.36,1), opacity 1s ease;`;
    document.body.appendChild(el);
    const ang = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 70;
    requestAnimationFrame(() => {
      el.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist - 30}px) scale(${0.5 + Math.random()})`;
      el.style.opacity = "0";
    });
    setTimeout(() => el.remove(), 1100);
  }
}

function finaleConfetti() {
  const canvas = $("#confettiCanvas");
  const ctx = canvas.getContext("2d");
  let w, h, pieces = [], raf, running = false;
  const colors = ["#ff9eb1", "#e76f8e", "#e0a96d", "#fff", "#ffd1dc"];

  const resize = () => {
    w = canvas.width  = canvas.offsetWidth  * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  };
  resize();
  window.addEventListener("resize", resize);

  const spawn = () => {
    pieces = Array.from({ length: 140 }, () => ({
      x: Math.random() * w,
      y: -Math.random() * h * 0.4,
      s: (4 + Math.random() * 7) * devicePixelRatio,
      vx: (Math.random() - 0.5) * 1.4 * devicePixelRatio,
      vy: (1.5 + Math.random() * 2.5) * devicePixelRatio,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      color: colors[(Math.random() * colors.length) | 0],
      heart: Math.random() < 0.4,
    }));
  };

  const loop = () => {
    ctx.clearRect(0, 0, w, h);
    let alive = false;
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vy += 0.02 * devicePixelRatio;
      if (p.y < h + 40) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.heart) {
        const s = p.s / 16;
        ctx.scale(s, s);
        ctx.beginPath();
        ctx.moveTo(0, 4);
        ctx.bezierCurveTo(-8, -4, -8, -12, 0, -8);
        ctx.bezierCurveTo(8, -12, 8, -4, 0, 4);
        ctx.fill();
      } else {
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      }
      ctx.restore();
    });
    if (alive) raf = requestAnimationFrame(loop);
    else { running = false; ctx.clearRect(0, 0, w, h); }
  };

  const fire = () => {
    if (reduceMotion) return;
    cancelAnimationFrame(raf);
    spawn();
    if (!running) { running = true; loop(); }
  };

  // fire when finale scrolls into view
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { fire(); } });
  }, { threshold: 0.5 });
  io.observe($("#finale"));

  $("#replayBtn").addEventListener("click", () => {
    $("#hero").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });
}

function setupMusic() {
  const btn = $("#musicToggle");
  const audio = $("#bgm");
  // hide if no source was added
  if (!audio.querySelector("source")) { btn.style.display = "none"; return; }
  btn.addEventListener("click", async () => {
    if (audio.paused) {
      try { await audio.play(); btn.setAttribute("aria-pressed", "true"); btn.title = "Pause music"; }
      catch (_) {}
    } else {
      audio.pause(); btn.setAttribute("aria-pressed", "false"); btn.title = "Play music";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  hydrate();
  startCounter();
  setupReveals();
  setupScrollCue();
  heartsBackground();
  finaleConfetti();
  setupMusic();
});
