// ============================================================
// render.js — Costruzione delle sezioni dai JSON originali
// (site.json, servizi.json, progetti.json, video.json)
// ============================================================

// ── Marquee: generato dai titoli dei servizi ────────────────
function renderMarquee(datiServizi) {
  const parole = (datiServizi.servizi || []).map((s) => s.titolo);
  buildMarquee(parole);
}

// ── Servizi (con dettagli + FAQ a fisarmonica) ──────────────
function renderServizi(dati) {
  const grid = document.getElementById("servizi-grid");
  const titolo = document.getElementById("servizi-titolo");
  const sotto = document.getElementById("servizi-sottotitolo");
  if (!grid) return;

  if (titolo && dati.titolo) titolo.textContent = dati.titolo;
  if (sotto && dati.sottotitolo) sotto.textContent = dati.sottotitolo;

  grid.innerHTML = (dati.servizi || [])
    .map(
      (s, i) => `
      <article class="servizio-card reveal reveal-delay-${i % 3}" style="--card-accent:${s.colore || "var(--accent)"}">
        <div class="servizio-icona" aria-hidden="true">${s.icona || "◆"}</div>
        <h3>${s.titolo}</h3>
        <p>${s.descrizione}</p>
        <ul class="servizio-dettagli">
          ${(s.dettagli || []).map((d) => `<li>${d}</li>`).join("")}
        </ul>
        ${renderFaq(s.faq)}
      </article>`,
    )
    .join("");

  // FAQ a fisarmonica
  grid.querySelectorAll(".faq-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      // Chiude le altre FAQ della stessa card
      item.closest(".servizio-faq").querySelectorAll(".faq-item.open")
        .forEach((el) => el.classList.remove("open"));
      item.classList.toggle("open", !wasOpen);
    });
  });

  // Popola anche il select del form
  const select = document.getElementById("f-servizio");
  if (select) {
    (dati.servizi || []).forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.titolo;
      opt.textContent = s.titolo;
      select.appendChild(opt);
    });
    const altro = document.createElement("option");
    altro.value = "Altro";
    altro.textContent = "Altro / non so ancora";
    select.appendChild(altro);
  }
}

function renderFaq(faq) {
  if (!faq || !faq.length) return "";
  return `
    <div class="servizio-faq">
      <div class="faq-label">Domande frequenti</div>
      ${faq
        .map(
          (f) => `
        <div class="faq-item">
          <button type="button" class="faq-toggle">
            <span>${f.domanda}</span>
            <span class="faq-icon" aria-hidden="true">+</span>
          </button>
          <div class="faq-risposta"><p>${f.risposta}</p></div>
        </div>`,
        )
        .join("")}
    </div>`;
}

// ── Progetti ────────────────────────────────────────────────
function renderProgetti(dati) {
  const grid = document.getElementById("progetti-grid");
  const titolo = document.getElementById("progetti-titolo");
  const sotto = document.getElementById("progetti-sottotitolo");
  if (!grid) return;

  if (titolo && dati.titolo) titolo.textContent = dati.titolo;
  if (sotto && dati.sottotitolo) sotto.textContent = dati.sottotitolo;

  grid.innerHTML = (dati.progetti || [])
    .map(
      (p, i) => `
      <article class="progetto-card reveal reveal-delay-${i % 3}" style="--card-accent:${p.colore || "var(--accent)"}">
        <div class="progetto-media">
          <img
            src="${p.immagine}"
            alt="${p.titolo}"
            loading="lazy"
            onerror="this.onerror=null;this.src='${p.immagine_placeholder || ""}'"
          />
        </div>
        <div class="progetto-body">
          <div class="progetto-meta">
            <span>${p.categoria || ""}</span>
            <span class="anno">${p.anno || ""}</span>
          </div>
          <h3>${p.titolo}</h3>
          <p>${p.descrizione || ""}</p>
          ${
            p.tecnologie && p.tecnologie.length
              ? `<div class="progetto-tags">${p.tecnologie
                  .map((t) => `<span class="tag">${t}</span>`)
                  .join("")}</div>`
              : ""
          }
        </div>
      </article>`,
    )
    .join("");
}

// ── Video ───────────────────────────────────────────────────
function renderVideo(dati) {
  const grid = document.getElementById("video-grid");
  const titolo = document.getElementById("video-titolo");
  const sotto = document.getElementById("video-sottotitolo");
  if (!grid) return;

  if (titolo && dati.titolo) titolo.textContent = dati.titolo;
  if (sotto && dati.sottotitolo) sotto.textContent = dati.sottotitolo;

  const lista = dati.video || [];
  if (!lista.length) {
    document.getElementById("video").style.display = "none";
    return;
  }

  grid.innerHTML = lista
    .map((v, i) => {
      let frame = "";
      if (v.tipo === "youtube" && v.id) {
        frame = `<iframe
          src="https://www.youtube-nocookie.com/embed/${v.id}"
          title="${v.titolo || "Video"}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>`;
      } else if (v.tipo === "mp4" && v.src) {
        frame = `<video controls preload="metadata" ${v.poster ? `poster="${v.poster}"` : ""}>
          <source src="${v.src}" type="video/mp4" />
          Il tuo browser non supporta il video.
        </video>`;
      } else {
        return "";
      }

      return `
      <article class="video-card reveal reveal-delay-${i % 3}">
        <div class="video-frame">${frame}</div>
        <div class="video-body">
          <h3>${v.titolo || ""}</h3>
          <p>${v.descrizione || ""}</p>
        </div>
      </article>`;
    })
    .join("");
}

// ── Team (da site.json) ─────────────────────────────────────
function renderTeam(site) {
  const grid = document.getElementById("team-grid");
  const sotto = document.getElementById("team-sottotitolo");
  if (!grid) return;

  const azienda = site.azienda || {};
  if (sotto && azienda.descrizione) sotto.textContent = azienda.descrizione;

  grid.innerHTML = (site.team || [])
    .map(
      (m, i) => `
      <article class="team-card reveal reveal-delay-${i % 3}">
        <div class="team-foto">
          <img src="${m.foto}" alt="${m.nome}" loading="lazy" />
        </div>
        <div class="team-body">
          <h3>${m.nome}</h3>
          <div class="team-ruolo">${m.ruolo || ""}</div>
          ${m.piva ? `<div class="team-piva">P.IVA ${m.piva}</div>` : ""}
          <div class="team-contatti">
            ${contattoTeam(m.contatti && m.contatti.whatsapp, "chat")}
            ${contattoTeam(m.contatti && m.contatti.telefono, "phone")}
            ${contattoTeam(m.contatti && m.contatti.email, "email")}
          </div>
        </div>
      </article>`,
    )
    .join("");
}

function contattoTeam(c, icona) {
  if (!c || !c.url) return "";
  return `<a href="${c.url}" target="_blank" rel="noopener" title="${c.label || ""}" aria-label="${c.label || ""}">
    <span class="material-icons">${icona}</span>
  </a>`;
}
