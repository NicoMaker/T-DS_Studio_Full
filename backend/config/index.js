// ============================================================
// config/index.js — Configurazione centralizzata (da .env)
// ============================================================
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,

  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  mailFrom: {
    name: process.env.MAIL_FROM_NAME || 'Nooo Agency',
    email: process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER,
  },

  mailTo: (process.env.MAIL_TO || process.env.SMTP_USER || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean),

  corsOrigin: process.env.CORS_ORIGIN || '*',

  azienda: {
    nome: 'Nooo Agency',
    email: 'info@noooagency.com',
    sito: 'www.noooagency.com',
  },
};
