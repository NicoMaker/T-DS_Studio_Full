// ============================================================
// data.js — Caricamento centralizzato dei file JSON
// ============================================================

const SiteData = {
  async load(nome) {
    const res = await fetch(`data/${nome}.json`);
    if (!res.ok) throw new Error(`Impossibile caricare data/${nome}.json (HTTP ${res.status})`);
    return res.json();
  },

  async loadAll() {
    const [site, servizi, progetti, video] = await Promise.all([
      this.load("site"),
      this.load("servizi"),
      this.load("progetti"),
      this.load("video"),
    ]);
    return { site, servizi, progetti, video };
  },
};
