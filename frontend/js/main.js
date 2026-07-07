// ============================================================
// main.js — Entry point del sito
// Carica i JSON, costruisce le sezioni, avvia animazioni e form
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
  initNav();

  try {
    const { site, servizi, progetti, video } = await SiteData.loadAll();

    renderMarquee(servizi);
    renderServizi(servizi);
    renderProgetti(progetti);
    renderVideo(video);
    renderTeam(site);

    FormContatti.init();
  } catch (err) {
    console.error("Errore nel caricamento dei dati del sito:", err);
  } finally {
    // Le animazioni partono dopo che il DOM è stato popolato
    initReveal();
    initCounters();
    initParallax();
    hidePageLoader();
  }
});
