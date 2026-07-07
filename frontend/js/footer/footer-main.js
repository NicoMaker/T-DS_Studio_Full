// ============================================================
// footer-main.js — Entry point del footer orari
// Carica data/footer.json, costruisce il footer e schedula
// gli aggiornamenti (ogni minuto + refresh a mezzanotte).
// Dipende da: date-utils.js, gestisci_chiusure.js,
//             gestisci_apertura.js, creazione_html.js,
//             aggiorna-orari.js, mappa.js
// ============================================================

// Per testare una data specifica, decommentare la riga sotto:
// const TEST_DATE = new Date("2026-12-25T10:30:00");
const getNow = () =>
  typeof TEST_DATE !== "undefined" ? TEST_DATE : new Date();

const FOOTER_JSON_URL = "data/footer.json";

document.addEventListener("DOMContentLoaded", () => {
  const footer = document.getElementById("Contatti");
  if (!footer) return;

  fetch(FOOTER_JSON_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      footer.innerHTML = createFooterHTML(data, getNow());

      setTimeout(() => {
        document.dispatchEvent(new CustomEvent("footerLoaded"));

        const now = getNow();
        const secondsToNextMinute = 60 - now.getSeconds();

        setTimeout(() => {
          aggiornaColoreOrari(data);
          setInterval(() => aggiornaColoreOrari(data), 60000);
        }, secondsToNextMinute * 1000);

        aggiornaColoreOrari(data);

        // Schedula il refresh intelligente a mezzanotte
        scheduleFooterRefreshAtMidnight(data);
      }, 100);
    })
    .catch((error) => {
      console.error("Errore nel caricamento dei dati del footer:", error);
      footer.innerHTML = `<p style="text-align:center; color: var(--cream, white);">Impossibile caricare le informazioni del footer.</p>`;
    });
});

// ── Ricostruisce il footer e reinizializza la mappa ──────────
function _ricostruisciFooter(data) {
  const footer = document.getElementById("Contatti");
  if (!footer || !data) return;

  footer.innerHTML = createFooterHTML(data, getNow());

  setTimeout(() => {
    aggiornaColoreOrari(data);
  }, 100);
}

function scheduleFooterRefreshAtMidnight(data) {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const msUntilMidnight = tomorrow.getTime() - now.getTime();

  console.log(
    `Prossimo aggiornamento footer schedulato tra ${Math.round(
      msUntilMidnight / 1000 / 60,
    )} minuti`,
  );

  setTimeout(() => {
    _ricostruisciFooter(data);
    scheduleFooterRefreshAtMidnight(data);
  }, msUntilMidnight);
}
