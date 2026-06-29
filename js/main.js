import { loadAllData } from './data.js';
import { initNav } from './nav.js';
import { initReveal } from './reveal.js';
import { renderProgetti, renderServizi, renderContatti, renderFooterSocial } from './render.js';
import { initParticles, initTypewriter, initCounter, initParallax, initMouseGlow } from './animations.js';

(async function () {
  'use strict';

  // Navbar e particelle si avviano subito
  initNav();
  const revealIO = initReveal();
  initParticles();
  initTypewriter();
  initParallax();
  initMouseGlow();

  try {
    // Carica tutti i dati
    const { siteData, progettiData, serviziData } = await loadAllData();

    // ---- AGGIORNO IL CONTATORE "PROGETTI REALIZZATI" ----
    const totalProgetti = progettiData.progetti.length;
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
      const label = item.querySelector('.label');
      if (label && label.textContent.trim() === 'Progetti realizzati') {
        // Sovrascrivo data-count con il numero reale
        item.dataset.count = totalProgetti;
      }
    });

    // Ora avvio i contatori animati (partono dal nuovo data-count)
    initCounter();

    // Render dei contenuti
    renderProgetti(progettiData, revealIO);
    renderServizi(serviziData, revealIO);
    renderContatti(siteData, revealIO);
    renderFooterSocial(siteData);
  } catch (err) {
    console.error('Errore caricamento dati:', err);
  }
})();