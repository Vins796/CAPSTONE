# Il Forno - Panetteria Online

## Descrizione
"Il Forno" è un'applicazione web per una panetteria di quartiere che offre ai clienti la possibilità di esplorare prodotti, effettuare ordini e interagire con il negozio online. L'applicazione è progettata per essere user-friendly, visivamente accattivante e funzionale sia su desktop che su dispositivi mobili.

## Caratteristiche Principali

### Frontend
- **Home Page**: Una pagina di benvenuto accattivante con una hero section che presenta la panetteria.
- **Catalogo Prodotti**: Una pagina che mostra tutti i prodotti disponibili con descrizioni dettagliate.
- **Profilo Utente**: Area personale per gli utenti registrati dove possono vedere i loro ordini e gestire le informazioni personali.
- **Carrello**: Funzionalità per aggiungere prodotti e procedere all'ordine.
- **Autenticazione**: Sistema di login/registrazione integrato con Auth0.

### Backend
- **API RESTful**: Gestisce le richieste dal frontend per prodotti, ordini e informazioni utente.
- **Database**: Utilizza MongoDB per memorizzare dati su prodotti, utenti e ordini.
- **Autenticazione**: Integrazione con Auth0 per la gestione sicura degli accessi.
- **Gestione Ordini**: Sistema per processare e tracciare gli ordini dei clienti.

## Tecnologie Utilizzate

### Frontend
- React.js
- React Router per la navigazione
- Framer Motion per le animazioni
- Tailwind CSS per lo styling
- Axios per le chiamate API
- Auth0 React SDK per l'autenticazione

### Backend
- Node.js con Express.js
- MongoDB con Mongoose ORM
- JWT per l'autenticazione interna
- Multer per la gestione del caricamento file
- Cors per la gestione delle richieste cross-origin

### Strumenti di Sviluppo
- Vite come build tool per il frontend
- ESLint e Prettier per il linting e la formattazione del codice
- Git per il controllo versione

## Funzionalità Dettagliate

1. **Autenticazione Utente**
   - Registrazione e login tramite Auth0
   - Gestione dei ruoli (utente standard e amministratore)

2. **Gestione Prodotti**
   - Visualizzazione di tutti i prodotti
   - Dettagli prodotto con ingredienti e descrizione
   - Funzionalità di ricerca e filtraggio (da implementare)

3. **Carrello e Ordini**
   - Aggiunta/rimozione prodotti dal carrello
   - Processo di checkout (simulato, senza pagamento reale)
   - Visualizzazione dello storico ordini per gli utenti

4. **Area Amministrativa**
   - Dashboard per la gestione dei prodotti
   - Visualizzazione e gestione degli ordini
   - Analisi delle vendite (da implementare)

5. **Responsive Design**
   - Layout adattivo per desktop, tablet e smartphone
   - Menu hamburger per la navigazione su dispositivi mobili

6. **Performance e UX**
   - Animazioni fluide per migliorare l'esperienza utente
   - Caricamento lazy delle immagini per ottimizzare le performance

## Installazione e Setup

1. Clona il repository
2. Installa le dipendenze per il frontend e il backend
3. Configura le variabili d'ambiente
4. Avvia il server backend
5. Avvia l'applicazione frontend

## Sviluppi Futuri
- Implementazione di un sistema di pagamento reale
- Aggiunta di un sistema di recensioni per i prodotti
- Integrazione con sistemi di notifica per aggiornamenti sugli ordini
- Espansione della dashboard amministrativa con analytics avanzate
