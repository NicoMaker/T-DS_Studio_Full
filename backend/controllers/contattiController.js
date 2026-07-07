// ============================================================
// controllers/contattiController.js — Logica del form contatti
// ============================================================
const { validaForm } = require('../utils/validators');
const { sendAzienda, sendCliente } = require('../services/email');

exports.inviaFormContatti = async (req, res) => {
  try {
    const { nome, cognome, email, servizio, telefono, messaggio } = req.body;

    // 1. Validazione lato server (mai fidarsi del client)
    const errori = validaForm(req.body);
    if (errori.length) {
      return res.status(400).json({ ok: false, errori });
    }

    const nomeCompleto = `${nome.trim()} ${cognome.trim()}`;
    const dati = {
      nome: nome.trim(),
      cognome: cognome.trim(),
      nomeCompleto,
      email: email.trim(),
      telefono: String(telefono).replace(/\s/g, ''),
      servizio,
      messaggio: messaggio.trim(),
    };

    // 2. Notifica all'azienda
    await sendAzienda(dati);

    // 3. Conferma automatica al cliente (se fallisce non blocca la risposta)
    try {
      await sendCliente(dati);
    } catch (err) {
      console.warn('⚠️  Conferma al cliente non inviata:', err.message);
    }

    return res.json({
      ok: true,
      message: 'Richiesta inviata! Ti risponderemo entro un giorno lavorativo.',
    });
  } catch (err) {
    console.error('❌ Errore invio email:', err);
    return res.status(500).json({
      ok: false,
      errori: [
        "Si è verificato un errore durante l'invio. Riprova più tardi o chiamaci direttamente.",
      ],
    });
  }
};
