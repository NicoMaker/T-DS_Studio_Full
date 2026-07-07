// ============================================================
// services/email/templates.js — Template HTML delle email
// Stile coerente con il sito (legno scuro + ambra)
// ============================================================
const { escapeHtml } = require('../../utils/validators');
const config = require('../../config');

const COLORI = {
  bg: '#0a0e1a',
  panel: '#121a2e',
  cream: '#eef2fb',
  muted: '#7c88a3',
  accent: '#4d8dff',
};

function layoutBase(titolo, corpo) {
  return `
  <div style="background:${COLORI.bg};padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:${COLORI.panel};border-radius:16px;overflow:hidden;border:1px solid rgba(243,234,217,0.12);">
      <div style="padding:28px 32px;border-bottom:1px solid rgba(243,234,217,0.12);">
        <div style="color:${COLORI.accent};font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:bold;">
          ${escapeHtml(config.azienda.nome)}
        </div>
        <h1 style="color:${COLORI.cream};font-size:22px;margin:10px 0 0;">${titolo}</h1>
      </div>
      <div style="padding:28px 32px;color:${COLORI.cream};font-size:15px;line-height:1.7;">
        ${corpo}
      </div>
      <div style="padding:20px 32px;border-top:1px solid rgba(243,234,217,0.12);color:${COLORI.muted};font-size:12px;">
        ${escapeHtml(config.azienda.nome)} · ${escapeHtml(config.azienda.sito)} · ${escapeHtml(config.azienda.email)}
      </div>
    </div>
  </div>`;
}

function rigaDato(label, valore) {
  return `
  <tr>
    <td style="padding:8px 0;color:${COLORI.muted};font-size:13px;text-transform:uppercase;letter-spacing:1px;vertical-align:top;width:140px;">${label}</td>
    <td style="padding:8px 0;color:${COLORI.cream};">${escapeHtml(valore)}</td>
  </tr>`;
}

// ── Email per l'azienda: nuova richiesta dal sito ──
function templateAzienda({ nomeCompleto, email, telefono, servizio, messaggio }) {
  const corpo = `
    <p style="margin:0 0 18px;">Hai ricevuto una nuova richiesta di preventivo dal sito:</p>
    <table style="width:100%;border-collapse:collapse;">
      ${rigaDato('Nome', nomeCompleto)}
      ${rigaDato('Email', email)}
      ${rigaDato('Telefono', telefono)}
      ${rigaDato('Servizio', servizio)}
    </table>
    <div style="margin-top:18px;padding:16px;background:rgba(217,151,60,0.08);border:1px solid rgba(217,151,60,0.3);border-radius:10px;">
      <div style="color:${COLORI.accent};font-size:12px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">Messaggio</div>
      <div style="white-space:pre-wrap;">${escapeHtml(messaggio)}</div>
    </div>
    <p style="margin:20px 0 0;color:${COLORI.muted};font-size:13px;">
      Puoi rispondere direttamente a questa email: il mittente è impostato sull'indirizzo del cliente.
    </p>`;
  return layoutBase('Nuova richiesta di preventivo', corpo);
}

// ── Email di conferma per il cliente ──
function templateCliente({ nome, servizio }) {
  const corpo = `
    <p style="margin:0 0 16px;">Ciao ${escapeHtml(nome)},</p>
    <p style="margin:0 0 16px;">
      grazie per averci scritto! Abbiamo ricevuto la tua richiesta
      ${servizio ? `per <strong style="color:${COLORI.accent};">${escapeHtml(servizio)}</strong>` : ''}
      e ti risponderemo entro un giorno lavorativo.
    </p>
    <p style="margin:0 0 16px;">
      Se hai fretta, puoi scriverci direttamente a
      <strong style="color:${COLORI.accent};">${escapeHtml(config.azienda.email)}</strong>.
    </p>
    <p style="margin:0;">A presto,<br/>la squadra della ${escapeHtml(config.azienda.nome)}</p>`;
  return layoutBase('Abbiamo ricevuto la tua richiesta', corpo);
}

module.exports = { templateAzienda, templateCliente };
