// ============================================================
// animations.js — Reveal allo scroll, contatori, parallax, loader
// ============================================================

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// ── Loader iniziale ─────────────────────────────────────────
function hidePageLoader() {
  const loader = document.getElementById("page-loader");
  if (!loader) return;
  loader.classList.add("hidden");
  setTimeout(() => loader.remove(), 700);
}

// ── Reveal allo scroll ──────────────────────────────────────
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// ── Contatori animati (sezione numeri) ─────────────────────
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animate = (el) => {
    const target = Number(el.dataset.count);
    const suffisso = el.dataset.suffix || "";
    if (prefersReducedMotion) {
      el.textContent = target + suffisso;
      return;
    }
    const durata = 1600;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / durata, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = Math.round(target * eased) + suffisso;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  counters.forEach((c) => obs.observe(c));
}

// ── Parallax leggero sull'hero ──────────────────────────────
function initParallax() {
  if (prefersReducedMotion) return;
  const media = document.getElementById("hero-media");
  if (!media) return;

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          media.style.transform = `translateY(${y * 0.22}px)`;
        }
        ticking = false;
      });
    },
    { passive: true },
  );
}

// ── Marquee (duplicazione contenuto per loop infinito) ──────
function buildMarquee(parole) {
  const track = document.getElementById("marquee-track");
  if (!track || !parole || !parole.length) return;

  const blocco = parole
    .map(
      (p) =>
        `<span class="marquee-item">${p} <span class="marquee-sep">✳</span></span>`,
    )
    .join("");

  // Due copie identiche per un loop continuo (translateX -50%)
  track.innerHTML = blocco + blocco;
}
