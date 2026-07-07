// ============================================================
// services/email/transporter.js — Connessione SMTP (Nodemailer)
// ============================================================
const nodemailer = require('nodemailer');
const config = require('../../config');

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

// Verifica la connessione all'avvio (solo log, non blocca il server)
transporter
  .verify()
  .then(() => console.log('✉️  SMTP pronto: le email possono essere inviate.'))
  .catch((err) =>
    console.warn('⚠️  SMTP non configurato o non raggiungibile:', err.message),
  );

module.exports = transporter;
