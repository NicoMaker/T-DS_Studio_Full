// ============================================================
// servizio-page.js — aggiornato per gestire il nuovo hero
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
  "use strict";

  const loadingEl = document.getElementById("sd-loading");
  const notfoundEl = document.getElementById("sd-notfound");
  const contentEl = document.getElementById("sd-content");

  try {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    const [siteData, progettiData, serviziData] = await Promise.all([
      SiteData.load("site"),
      SiteData.load("progetti"),
      SiteData.load("servizi"),
    ]);

    window.API_URL = siteData.azienda.apiUrl || "/api/contatti";
    renderFooterSocial(siteData);

    const servizio = (serviziData.servizi || []).find((s) => s.slug === slug);

    if (!servizio) {
      loadingEl.style.display = "none";
      notfoundEl.style.display = "";
      initNav();
      return;
    }

    document.title = `${servizio.titolo} – T-DS Studio`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", servizio.descrizione);

    // ── HERO: immagine a sinistra, testo a destra ──
    const heroImg = document.getElementById("sd-hero-img");
    const fallback = document.getElementById("sd-hero-fallback");

    if (servizio.icona) {
      const isUrl = /^https?:\/\/|\//i.test(servizio.icona);
      if (isUrl) {
        heroImg.src = servizio.icona;
        heroImg.alt = servizio.titolo;
        heroImg.style.display = "block";
        fallback.style.display = "none";
      } else {
        // Icona (emoji o material icon) → mostra fallback
        heroImg.style.display = "none";
        fallback.style.display = "grid";
        const iconEl = fallback.querySelector(".material-icons");
        if (iconEl) iconEl.textContent = servizio.icona || "business";
      }
    } else {
      heroImg.style.display = "none";
      fallback.style.display = "grid";
    }

    heroImg.onerror = function () {
      this.style.display = "none";
      fallback.style.display = "grid";
    };

    document.getElementById("sd-title").textContent = servizio.titolo;
    document.getElementById("sd-desc").textContent = servizio.descrizione;

    // ── LISTA "Cosa include" ──
    const lista = document.getElementById("sd-lista");
    lista.classList.add("lista-check");
    lista.innerHTML = (servizio.dettagli || [])
      .map((d) => `<li>${d}</li>`)
      .join("");

    // ── FAQ ──
    const faqWrap = document.getElementById("sd-faq");
    if (servizio.faq && servizio.faq.length) {
      faqWrap.innerHTML = servizio.faq
        .map(
          (f, i) => `
          <div class="faq-item">
            <button class="faq-toggle" aria-expanded="false" aria-controls="faq-body-${i}">
              <span class="faq-label">${f.domanda}</span>
              <span class="faq-plus" aria-hidden="true">+</span>
            </button>
            <div class="faq-body" id="faq-body-${i}">
              <p>${f.risposta}</p>
            </div>
          </div>
        `,
        )
        .join("");

      faqWrap.querySelectorAll(".faq-toggle").forEach((btn) => {
        btn.addEventListener("click", () => {
          const item = btn.closest(".faq-item");
          const eraAperta = item.classList.contains("open");

          faqWrap.querySelectorAll(".faq-item").forEach((el) => {
            el.classList.remove("open");
            el.querySelector(".faq-toggle").setAttribute(
              "aria-expanded",
              "false",
            );
          });

          if (!eraAperta) {
            item.classList.add("open");
            btn.setAttribute("aria-expanded", "true");
          }
        });
      });
    } else {
      faqWrap.innerHTML = "";
    }

    // ── Progetti correlati (codice invariato) ──
    // ... (il resto del codice rimane uguale) ...

    // ── Mostra contenuto ──
    loadingEl.style.display = "none";
    contentEl.style.display = "";

    initNav();
    initReveal();
    if (typeof initMagneticButtons === "function") initMagneticButtons();

    requestAnimationFrame(() => requestAnimationFrame(scrollToCurrentHash));
  } catch (err) {
    console.error("Errore caricamento servizio:", err);
    loadingEl.style.display = "none";
    notfoundEl.style.display = "";
    initNav();
  }
});

window.addEventListener("load", scrollToCurrentHash);
