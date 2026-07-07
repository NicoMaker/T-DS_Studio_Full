# Nooo Agency — Sito web completo

Sito moderno con animazioni + backend Node.js per il form contatti + footer con orari in tempo reale.

## Struttura

```
├── frontend/                  ← il sito
│   ├── index.html
│   ├── css/style.css          ← tema, animazioni, responsive
│   ├── js/
│   │   ├── main.js            ← entry point
│   │   ├── data.js            ← caricamento JSON
│   │   ├── nav.js             ← navbar + menu mobile
│   │   ├── animations.js      ← reveal, parallax, marquee, loader
│   │   ├── render.js          ← costruzione sezioni dai JSON
│   │   ├── phone-input.js     ← campo cellulare con bandiera/prefisso
│   │   ├── form.js            ← validazione + invio form
│   │   └── footer/            ← sistema orari (i tuoi file, integrati)
│   ├── data/                  ← TUTTI i contenuti modificabili qui
│   │   ├── site.json          ← azienda, team, social (dati originali)
│   │   ├── servizi.json       ← servizi + FAQ (dati originali)
│   │   ├── progetti.json      ← portfolio (dati originali)
│   │   ├── video.json         ← video YouTube o mp4
│   │   └── footer.json        ← orari, festività, chiusure, stagioni
│   ├── img/progetti/          ← metti qui le foto dei progetti
│   └── video/                 ← metti qui gli mp4
└── backend/                   ← server Node.js (Express + Nodemailer)
    ├── server.js              ← avvio
    ├── app.js                 ← configurazione Express
    ├── config/                ← lettura .env
    ├── routes/                ← rotte API
    ├── controllers/           ← logica del form
    ├── middlewares/           ← gestione errori + anti-spam
    ├── services/email/        ← invio email (azienda + conferma cliente)
    └── utils/                 ← validatori e helper
```

## Avvio rapido

```bash
cd backend
cp .env.example .env    # poi compila SMTP_USER, SMTP_PASS ecc.
npm install
npm start               # apri http://localhost:3000
```

Il backend serve anche il frontend, quindi basta un solo comando.

## Cosa modificare per personalizzare

| Cosa | Dove |
|---|---|
| Orari, festività, ferie, chiusure, stagioni | `frontend/data/footer.json` |
| Team, descrizione azienda, social | `frontend/data/site.json` |
| Servizi + FAQ (anche le voci del form) | `frontend/data/servizi.json` |
| Progetti/portfolio | `frontend/data/progetti.json` |
| Video (YouTube o mp4) | `frontend/data/video.json` |
| Email di destinazione del form | `backend/.env` → `MAIL_TO` |

### Video
In `video.json` ogni video è:
- YouTube: `{ "tipo": "youtube", "id": "ID_DEL_VIDEO", "titolo": "...", "descrizione": "..." }`
- File mp4: `{ "tipo": "mp4", "src": "video/nomefile.mp4", "poster": "img/poster.jpg", ... }`

## Form contatti

- **Email**: accetta solo indirizzi validi (bloccato sia nel browser sia sul server; gli spazi non si possono nemmeno digitare).
- **Cellulare**: solo cifre — lettere e simboli vengono bloccati alla digitazione (anche se incollati).
  Bandiera con selettore nazione e prefisso (default Italia +39); la lunghezza valida cambia in base alla nazione.
- **Anti-spam**: massimo 5 invii ogni 15 minuti per IP.
- Vengono inviate 2 email: una a te (con "Rispondi" che va al cliente) e una di conferma al cliente.

## Footer orari

Il footer mostra SOLO gli orari (niente mappa, niente contatti), con il tuo sistema integrato senza modifiche di logica:
- stato live (aperto / in apertura / in chiusura / chiuso) aggiornato ogni minuto
- gestione festività, ferie, chiusure e orari extra da `footer.json`
- cambio stagione automatico con countdown
- refresh automatico a mezzanotte

Per testare una data specifica: decommenta `TEST_DATE` in `frontend/js/footer/footer-main.js`.
