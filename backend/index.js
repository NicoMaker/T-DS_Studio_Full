/* ============================================
   index.js — Server Node.js (Express + Nodemailer)
   Gestisce l'invio email del form contatti
   di Nooo Agency: invia un'email al destinatario
   (azienda) e una di conferma al mittente.
   ============================================ */

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const os = require('os')
const https = require('https')

const app = express()
const PORT = process.env.PORT || 3000

// ---------- MIDDLEWARE ----------
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve il frontend statico (index.html, servizio.html, css, js, data, img)
// Cartella principale del sito = una directory sopra /server
const path = require('path')
app.use(express.static(path.join(__dirname, '../frontend')))

// ---------- TRANSPORTER NODEMAILER ----------
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10) || 465,
  secure: process.env.SMTP_SECURE === 'true', // true per porta 465, false per 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Verifica connessione SMTP all'avvio (solo log, non blocca il server)
transporter.verify(err => {
  if (err) {
    console.error('❌ Errore configurazione SMTP:', err.message)
  } else {
    console.log("✅ Server SMTP pronto per l'invio email")
  }
})

// ---------- HELPER: VALIDAZIONE CAMPI ----------
function validaForm(body) {
  const errori = []
  const campiObbligatori = {
    nome: 'Nome',
    cognome: 'Cognome',
    email: 'Email',
    servizio: 'Servizio desiderato',
    telefono: 'Numero di cellulare',
    messaggio: 'Messaggio',
  }

  for (const [campo, label] of Object.entries(campiObbligatori)) {
    if (!body[campo] || !String(body[campo]).trim()) {
      errori.push(`Il campo "${label}" è obbligatorio.`)
    }
  }

  // Validazione email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (body.email && !emailRegex.test(body.email.trim())) {
    errori.push("L'indirizzo email non è valido.")
  }

  // Validazione telefono (numeri, spazi, +, -, parentesi — minimo 6 cifre)
  const telefonoDigits = body.telefono ? body.telefono.replace(/\D/g, '') : ''
  if (body.telefono && telefonoDigits.length < 6) {
    errori.push('Il numero di cellulare non è valido.')
  }

  return errori
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// ---------- ROUTE: INVIO FORM CONTATTI ----------
app.post('/api/contatti', async (req, res) => {
  try {
    const { nome, cognome, email, servizio, telefono, messaggio } = req.body

    const errori = validaForm(req.body)
    if (errori.length) {
      return res.status(400).json({ ok: false, errori })
    }

    const nomeCompleto = `${nome.trim()} ${cognome.trim()}`
    const destinatari = (process.env.MAIL_TO || process.env.SMTP_USER)
      .split(',')
      .map(e => e.trim())
      .filter(Boolean)

    const mailFrom = `"${process.env.MAIL_FROM_NAME || 'Nooo Agency'}" <${
      process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER
    }>`

    // ---------- 1) Email all'AZIENDA (te) con i dati della richiesta ----------
    const htmlAzienda = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; color:#1a1a2e;">
        <h2 style="color:#1a6cff;">📩 Nuova richiesta dal sito Nooo Agency</h2>
        <table style="width:100%; border-collapse:collapse; margin-top:16px;">
          <tr><td style="padding:8px; font-weight:bold; width:160px;">Nome:</td><td style="padding:8px;">${escapeHtml(nome)}</td></tr>
          <tr style="background:#f5f7fb;"><td style="padding:8px; font-weight:bold;">Cognome:</td><td style="padding:8px;">${escapeHtml(cognome)}</td></tr>
          <tr><td style="padding:8px; font-weight:bold;">Email:</td><td style="padding:8px;">${escapeHtml(email)}</td></tr>
          <tr style="background:#f5f7fb;"><td style="padding:8px; font-weight:bold;">Telefono:</td><td style="padding:8px;">${escapeHtml(telefono)}</td></tr>
          <tr><td style="padding:8px; font-weight:bold;">Servizio desiderato:</td><td style="padding:8px;">${escapeHtml(servizio)}</td></tr>
        </table>
        <h3 style="margin-top:24px; color:#1a6cff;">Messaggio:</h3>
        <p style="background:#f5f7fb; padding:16px; border-radius:8px; white-space:pre-wrap;">${escapeHtml(messaggio)}</p>
        <hr style="margin-top:24px; border:none; border-top:1px solid #eee;">
        <p style="font-size:12px; color:#888;">Inviato automaticamente dal form contatti del sito noooagency.com</p>
      </div>
    `

    // ---------- 2) Email di CONFERMA al cliente che ha compilato il form ----------
    const htmlCliente = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; color:#1a1a2e;">
        <h2 style="color:#1a6cff;">Grazie per averci contattato, ${escapeHtml(nome)}! 🎉</h2>
        <p>Abbiamo ricevuto la tua richiesta riguardante <strong>${escapeHtml(servizio)}</strong> e ti risponderemo entro poche ore.</p>
        <p style="background:#f5f7fb; padding:16px; border-radius:8px; white-space:pre-wrap;"><strong>Il tuo messaggio:</strong><br>${escapeHtml(messaggio)}</p>
        <p>A presto,<br><strong>Il team di Nooo Agency</strong></p>
        <hr style="margin-top:24px; border:none; border-top:1px solid #eee;">
        <p style="font-size:12px; color:#888;">Questa è una email automatica di conferma, non rispondere a questo indirizzo.</p>
      </div>
    `

    // Invio email all'azienda
    await transporter.sendMail({
      from: mailFrom,
      to: destinatari,
      replyTo: email.trim(),
      subject: `🌐 Nuova richiesta: ${servizio} — ${nomeCompleto}`,
      html: htmlAzienda,
    })

    // Invio email di conferma al cliente
    await transporter.sendMail({
      from: mailFrom,
      to: email.trim(),
      subject: 'Abbiamo ricevuto la tua richiesta — Nooo Agency',
      html: htmlCliente,
    })

    return res.json({
      ok: true,
      message: 'Messaggio inviato con successo! Ti risponderemo al più presto.',
    })
  } catch (err) {
    console.error('❌ Errore invio email:', err)
    return res.status(500).json({
      ok: false,
      errori: [
        "Si è verificato un errore durante l'invio. Riprova più tardi o contattaci telefonicamente.",
      ],
    })
  }
})

// ---------- HEALTH CHECK ----------
app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'online' })
})

// ---------- HELPER: IP LOCALE ----------
function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return '127.0.0.1'
}

// ---------- HELPER: IP PUBBLICO ----------
function getPublicIP() {
  return new Promise(resolve => {
    https
      .get('https://api.ipify.org', resp => {
        let data = ''
        resp.on('data', chunk => (data += chunk))
        resp.on('end', () => resolve(data || 'N/D'))
      })
      .on('error', () => resolve('N/D'))
  })
}

// ---------- AVVIO SERVER ----------
async function avvia() {
  const localIP = getLocalIP()
  const publicIP = await getPublicIP()

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server avviato con successo!`)
    console.log(`🌐 IP Pubblico: http://${publicIP}:${PORT}`)
    console.log(`🏠 IP Locale:   http://${localIP}:${PORT}`)
    console.log(`📍 Localhost:   http://localhost:${PORT}`)
    console.log(`\n--------------------------------------`)
  })
}

avvia()
