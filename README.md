# Calendario PWA

## Descrizione

Calendario PWA personale, offline-first, progettato per iPhone.

L'obiettivo è realizzare un'applicazione estremamente semplice, veloce e curata, con un'esperienza il più possibile simile a quella di un'app nativa Apple.

L'app utilizza una singola schermata principale composta da un calendario mensile e dalla sezione "Prossimi impegni". Tutte le operazioni vengono eseguite tramite popup.

---

# Tecnologie

- HTML5
- CSS3
- JavaScript (ES6)
- IndexedDB
- Service Worker
- Web App Manifest

---

# Struttura del progetto

```
Calendario/
│
├── README.md
├── SPEC.md
├── AI_INSTRUCTIONS.md
│
├── assets/
├── figma/
└── src/
```

---

# Documentazione

## SPEC.md

Documento principale del progetto.

Contiene:

- requisiti funzionali;
- comportamento dell'app;
- architettura;
- modello dati;
- flussi;
- edge case;
- decisioni progettuali.

## AI_INSTRUCTIONS.md

Definisce le regole operative che ogni assistente IA deve seguire durante lo sviluppo.

---

# Design

Il file Figma rappresenta la fonte ufficiale dell'interfaccia.

Gli screenshot presenti nella cartella `figma/screenshots` sono utilizzati come riferimento visivo.

In caso di conflitto:

- Figma prevale per l'interfaccia grafica.
- SPEC.md prevale per il comportamento dell'app.

---

# Filosofia del progetto

- Offline First
- Nessun login
- Nessun cloud
- Nessuna sincronizzazione
- Solo Dark Mode
- Solo italiano
- Interfaccia minimale
- Massimo tre tocchi per ogni operazione
- Esperienza simile ad un'app nativa Apple

---

# Regole di sviluppo

Prima di modificare il codice è obbligatorio:

1. leggere completamente `SPEC.md`;
2. leggere `AI_INSTRUCTIONS.md`;
3. analizzare il file Figma e gli screenshot;
4. solo dopo implementare la funzionalità richiesta.

Non modificare il comportamento dell'app o la grafica senza aggiornare prima la documentazione ufficiale.