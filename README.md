# Nooo Agency — Sito + Form Contatti (Node.js + Nodemailer)

## Struttura del progetto

```
nooo-agency/
├── index.html / servizio.html      ← frontend (invariato + nuovo form contatti)
├── css/style.css
├── js/                              ← main.js, form.js, render.js, ecc.
├── data/                            ← servizi.json, progetti.json, site.json
├── img/
└── server/                          ← BACKEND Node.js
    ├── index.js                     ← server Express + Nodemailer
    ├── package.json
    ├── .env                         ← configurazione email (DA COMPILARE)
    └── .env.example
```

## 1. Configurazione email (.env)

Apri `server/.env` e inserisci i dati del tuo provider SMTP:

```env
PORT=3000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tuonome@gmail.com
SMTP_PASS=la_tua_password_app

MAIL_FROM_NAME=Nooo Agency - Sito Web
MAIL_FROM_EMAIL=tuonome@gmail.com

MAIL_TO=destinatario@noooagency.com,tuaemail@gmail.com

CORS_ORIGIN=*
```

**Gmail:** non usare la password normale dell'account. Devi creare una
"Password per le app" da: Account Google → Sicurezza → Verifica in due passaggi
→ Password per le app. Copia la password generata in `SMTP_PASS`.

**Altri provider comuni:**
- Aruba: `smtp.aruba.it`, porta `465`, `SMTP_SECURE=true`
- Register.it: `smtp.register.it`, porta `465`
- Outlook/Office365: `smtp.office365.com`, porta `587`, `SMTP_SECURE=false`
- Zoho: `smtp.zoho.eu`, porta `465`

`MAIL_TO` può contenere più indirizzi separati da virgola: ogni richiesta dal
form verrà inviata a tutti questi indirizzi, e una mail di conferma verrà
inviata anche al cliente che ha compilato il form.

## 2. Installazione

```bash
cd server
npm install
```

## 3. Avvio del server

```bash
npm start
```

Il server:
- avvia il backend Express con l'endpoint `POST /api/contatti`
- serve anche il frontend statico (index.html, css, js, data, img) sulla
  stessa porta, quindi puoi aprire direttamente `http://localhost:3000`
- stampa nel terminale l'IP locale, l'IP pubblico e l'URL di localhost

Output atteso:

```
🚀 Server avviato con successo!
🌐 IP Pubblico: http://1.2.3.4:3000
🏠 IP Locale:   http://192.168.1.10:3000
📍 Localhost:   http://localhost:3000
```

## 4. Come funziona il form

Il form "Contatti" nel sito (`index.html`) ha i seguenti campi, tutti
obbligatori:

- Nome
- Cognome
- Email
- Numero di cellulare
- Servizio desiderato (select, popolata automaticamente da `data/servizi.json`)
- Messaggio

Alla submit, `js/form.js`:
1. valida i campi lato client
2. invia una richiesta `POST` a `/api/contatti` con i dati in JSON
3. mostra un messaggio di successo o errore sotto il form

Il backend (`server/index.js`):
1. rivalida i campi lato server
2. invia un'email all'azienda (agli indirizzi in `MAIL_TO`) con tutti i
   dettagli della richiesta
3. invia un'email di conferma automatica al cliente che ha scritto

## 5. Sviluppo con auto-reload (opzionale)

```bash
npm run dev
```

(richiede `nodemon`, già incluso nelle devDependencies)

## 6. Note per la produzione

- Imposta `CORS_ORIGIN` con il dominio reale del sito (es.
  `https://www.noooagency.com`) invece di `*`.
- Se il frontend viene servito da un hosting diverso dal backend, aggiorna
  `API_URL` in `js/form.js` con l'URL completo del backend
  (es. `https://api.noooagency.com/api/contatti`).
- Mantieni il file `.env` privato: non committarlo mai su repository pubblici
  (è già escluso da `.gitignore`).
