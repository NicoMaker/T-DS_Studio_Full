/* ============================================
   form.js — Gestione form contatti
   Popola la select "servizio", valida i campi
   e invia i dati al backend Node.js (Nodemailer)
   ============================================ */

import { loadJSON } from './data.js'

// URL dell'API backend.
// In sviluppo locale: http://localhost:3000/api/contatti
// In produzione: stesso dominio del sito -> /api/contatti
const API_URL = '/api/contatti'

;(async function initForm() {
  const form = document.getElementById('form-contatti')
  if (!form) return

  const selectServizio = document.getElementById('f-servizio')
  const feedbackEl = document.getElementById('form-feedback')
  const submitBtn = document.getElementById('form-submit-btn')

  // --- Popolo la select "Servizio desiderato" dai dati servizi.json ---
  try {
    const serviziData = await loadJSON('data/servizi.json')
    if (selectServizio && serviziData?.servizi) {
      serviziData.servizi.forEach(s => {
        const opt = document.createElement('option')
        opt.value = s.titolo
        opt.textContent = `${s.icona} ${s.titolo}`
        selectServizio.appendChild(opt)
      })
      const altro = document.createElement('option')
      altro.value = 'Altro / non so ancora'
      altro.textContent = '✨ Altro / non so ancora'
      selectServizio.appendChild(altro)
    }
  } catch (err) {
    console.error('Errore caricamento servizi per il form:', err)
  }

  function showFeedback(message, type) {
    feedbackEl.textContent = message
    feedbackEl.className = `form-feedback ${type} visible`
  }

  function clearFieldErrors() {
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'))
  }

  function validateClientSide(data) {
    const errori = []
    const campi = {
      nome: 'Nome',
      cognome: 'Cognome',
      email: 'Email',
      servizio: 'Servizio desiderato',
      telefono: 'Numero di cellulare',
      messaggio: 'Messaggio',
    }

    clearFieldErrors()

    for (const [campo, label] of Object.entries(campi)) {
      const value = (data[campo] || '').trim()
      if (!value) {
        errori.push(`Il campo "${label}" è obbligatorio.`)
        const input = form.querySelector(`[name="${campo}"]`)
        if (input) input.closest('.form-group')?.classList.add('error')
      }
    }

    const emailVal = (data.email || '').trim()
    if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      errori.push("L'indirizzo email non è valido.")
      form.querySelector('[name="email"]')?.closest('.form-group')?.classList.add('error')
    }

    const telDigits = (data.telefono || '').replace(/\D/g, '')
    if (data.telefono && telDigits.length < 6) {
      errori.push('Il numero di cellulare non è valido.')
      form.querySelector('[name="telefono"]')?.closest('.form-group')?.classList.add('error')
    }

    return errori
  }

  form.addEventListener('submit', async e => {
    e.preventDefault()
    feedbackEl.className = 'form-feedback'
    feedbackEl.textContent = ''

    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    const erroriClient = validateClientSide(data)
    if (erroriClient.length) {
      showFeedback(erroriClient.join(' '), 'error')
      return
    }

    submitBtn.disabled = true
    submitBtn.classList.add('loading')
    const btnTextEl = submitBtn.querySelector('.btn-text')
    const originalText = btnTextEl.textContent
    btnTextEl.textContent = 'Invio in corso…'

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (res.ok && result.ok) {
        showFeedback(
          result.message || 'Messaggio inviato con successo! Ti risponderemo al più presto.',
          'success'
        )
        form.reset()
        clearFieldErrors()
      } else {
        const msg =
          result.errori && result.errori.length
            ? result.errori.join(' ')
            : 'Si è verificato un errore durante l\'invio. Riprova più tardi.'
        showFeedback(msg, 'error')
      }
    } catch (err) {
      console.error('Errore invio form:', err)
      showFeedback(
        'Impossibile contattare il server. Controlla la connessione e riprova, oppure scrivici via WhatsApp.',
        'error'
      )
    } finally {
      submitBtn.disabled = false
      submitBtn.classList.remove('loading')
      btnTextEl.textContent = originalText
    }
  })
})()
