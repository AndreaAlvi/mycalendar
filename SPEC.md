# Calendario PWA
## Software Design Specification (SDS)

Versione documento: 1.0 (Bozza)
Stato: In progettazione

---

# 1. Visione del progetto

## 1.1 Obiettivo

Realizzare una Progressive Web App (PWA) installabile su iPhone che permetta la gestione dei propri impegni tramite un calendario mensile.

L'applicazione è destinata esclusivamente ad un utilizzo personale.

Il progetto nasce con un obiettivo molto preciso:

realizzare un'app estremamente semplice da utilizzare, esteticamente curata e completamente offline.

L'app non vuole competere con Google Calendar, Apple Calendar o altre applicazioni professionali.

Vuole essere un calendario personale minimale.

---

## 1.2 Filosofia

Ogni scelta progettuale dovrà rispettare questi principi.

- semplicità prima di tutto
- massimo tre tocchi per eseguire un'operazione
- nessun menu inutile
- nessuna funzione superflua
- grafica pulita
- animazioni fluide
- utilizzo immediato
- esperienza simile ad un'app nativa Apple

Se una funzione rende l'app più complicata senza apportare un reale vantaggio, non deve essere implementata.

---

## 1.3 Caratteristiche principali

- completamente offline
- nessun account
- nessun login
- nessun cloud
- nessuna sincronizzazione
- salvataggio locale
- installabile come PWA
- ottimizzata per iPhone

---

# 2. Tecnologie

Il progetto utilizzerà esclusivamente tecnologie web standard.

## Frontend

- HTML5
- CSS3
- JavaScript ES6

## Persistenza dati

IndexedDB

## Offline

Service Worker

## Installazione

Manifest PWA

---

# 3. Architettura del progetto

La struttura del progetto dovrà rimanere stabile per tutta la durata dello sviluppo.

```

Calendario/

assets/

fonts/

icons/

images/

css/

js/

docs/

index.html

manifest.json

service-worker.js

```

Ogni cartella ha uno scopo preciso.

Non dovranno essere creati file inutili.

---

# 4. Design System

## Font

Inter

Utilizzare esclusivamente questo font.

---

## Palette

Sfondo

#171717

Viola

#530FE8

Rosso

#FF0000

Giallo

#D5CE04

Verde

#00AD1D

---

## Tema

Solo Dark Mode.

Non è prevista una modalità chiara.

---

## Animazioni

Le animazioni devono ispirarsi allo stile Apple.

Caratteristiche:

- morbide
- eleganti
- non invasive
- durata breve
- easing naturale

Mai utilizzare animazioni vistose.

---

## Bordi

Tutti gli elementi dovranno utilizzare angoli arrotondati.

L'interfaccia non dovrà contenere spigoli vivi.

---

## Ombre

Leggere.

Utilizzate solo quando migliorano la percezione della profondità.

# UI Fidelity

Il file Figma rappresenta la fonte ufficiale dell'interfaccia.

Regole obbligatorie:

- Replica pixel-perfect del mockup.
- Non modificare layout, spaziature, font, colori, icone o animazioni.
- Non introdurre componenti non presenti nel mockup.
- Tutte le misure devono derivare dal file Figma.
- Se una scelta grafica non è chiara, chiedere chiarimenti invece di interpretarla.
- In caso di conflitto:
  - Figma prevale per l'aspetto grafico.
  - SPEC prevale per il comportamento dell'app.

---

# 5. Schermata Home

La Home rappresenta la schermata principale dell'app.

È l'unica schermata permanente.

Tutte le altre funzionalità vengono aperte tramite popup.

---

## Contenuto

La schermata contiene:

- titolo del mese
- freccia mese precedente
- freccia mese successivo
- calendario
- sezione Prossimi impegni

---

## Titolo

Formato

Ago 2026

Utilizzare sempre il nome abbreviato del mese.

---

## Calendario

La settimana inizia di Lunedì.

Devono essere mostrati esclusivamente i giorni appartenenti al mese corrente.

Non mostrare giorni del mese precedente o successivo.

---

## Giorno corrente

Il giorno corrente è evidenziato tramite:

cerchio viola pieno

numero bianco

---

## Cambio mese

Possibile esclusivamente tramite le frecce.

Non è previsto lo swipe.

Il cambio mese dovrà essere animato.

---

# 6. Gestione eventi

Ogni giorno può contenere massimo tre eventi.

Non è possibile superare questo limite.

---

## Ordine

Gli eventi vengono ordinati:

1. orario

2. eventi senza orario

Se due eventi possiedono lo stesso orario viene mantenuto l'ordine di creazione.

---

## Priorità

Esistono tre priorità.

Alta

Media

Bassa

---

Gli indicatori sul calendario devono essere identici al mockup Figma.

Il design del file Figma rappresenta la fonte ufficiale per forma, dimensione, posizione e colore degli indicatori.

---

# 7. Popup

L'app utilizza esclusivamente popup.

Non esistono schermate dedicate alla modifica degli eventi.

---

## Popup disponibili

Popup Viola

Creazione

Modifica

---

Popup Rosso

Visualizzazione evento priorità Alta

---

Popup Giallo

Visualizzazione evento priorità Media

---

Popup Verde

Visualizzazione evento priorità Bassa

---

## Apertura

Tap sul giorno.

---

## Chiusura

Tap sullo sfondo nero.

Le modifiche non salvate vengono perse.

Non mostrare conferme.

---

## Posizionamento

Popup centrato.

Overlay nero trasparente.

---

# 8. Creazione evento

Campi disponibili.

Evento

Orario

Priorità

Ricorrenza

---

## Obbligatori

Evento

Priorità

---

## Facoltativi

Orario

Ricorrenza

---

## Pulsante +

Sempre visibile.

Disabilitato finché Evento e Priorità non risultano validi.

---

# 9. Gestione orario

Placeholder

--:--

---

## Tastiera

Aprire direttamente il tastierino numerico.

---

## Formattazione automatica

15

↓

15:00

9

↓

09:00

930

↓

09:30

1500

↓

15:00

15.00

↓

15:00

---

## Errori

Input non validi.

Ore inesistenti.

Minuti inesistenti.

Caratteri non numerici.

In presenza di errore il pulsante "+" rimane disabilitato.

---

# 10. Ricorrenze

Disponibili:

Ogni settimana

Ogni mese

Ogni anno

Nessuna opzione selezionata significa:

nessuna ricorrenza.

---

## Eliminazione

Eliminando una ricorrenza viene eliminata tutta la serie.

---

## Modifica

Le modifiche vengono propagate alle ricorrenze future.

---

## Casi particolari

Evento mensile il giorno 31.

Nei mesi con meno giorni viene creato l'ultimo giorno disponibile.

---

Evento annuale il 29 febbraio.

Negli anni non bisestili l'evento non viene creato.

---

# 11. Prossimi impegni

La sezione "Prossimi impegni" è sempre visibile sotto al calendario.

Ha lo scopo di mostrare rapidamente i prossimi eventi senza dover cercare nel calendario.

---

## Numero massimo

Visualizzare massimo 3 eventi.

---

## Ordinamento

Gli eventi vengono ordinati cronologicamente.

Ordine di ordinamento:

1. Data
2. Orario
3. Ordine di creazione

Gli eventi senza orario vengono sempre posizionati dopo quelli con orario della stessa giornata.

---

## Eventi mostrati

Devono essere mostrati esclusivamente:

- evento del giorno corrente
- eventi futuri

Gli eventi passati non devono mai comparire.

---

## Rimozione automatica

Gli eventi del giorno corrente rimangono visibili fino alle ore 00:00.

Allo scoccare della mezzanotte vengono rimossi automaticamente dalla lista.

---

## Nessun evento

Se non esistono eventi futuri la sezione rimane completamente vuota.

Non mostrare testi come:

"Nessun evento"

"Nessun impegno"

---

## Card

Ogni evento è rappresentato da una card.

La card mostra solamente:

- orario (se presente)
- nome evento

La priorità viene rappresentata esclusivamente tramite il colore della card.

---

## Espansione

Premendo una card:

la card si espande.

Non vengono espanse le altre.

Durante l'espansione compare esclusivamente il pulsante:

Cancella impegno

Nessun'altra informazione viene mostrata.

---

# 12. Flussi dell'applicazione

Questa sezione descrive il comportamento previsto.

---

## FLUSSO 01

Creazione evento.

Utente

↓

Tap su giorno vuoto

↓

Apertura popup viola

↓

Compilazione dati

↓

Tap pulsante +

↓

Salvataggio

↓

Chiusura popup

↓

Aggiornamento calendario

↓

Aggiornamento prossimi impegni

---

## FLUSSO 02

Visualizzazione evento.

Tap giorno

↓

Popup colore priorità

↓

Visualizzazione dati

---

## FLUSSO 03

Modifica.

Tap giorno

↓

Popup colore

↓

Tap matita

↓

Popup viola

↓

Modifica

↓

+

↓

Salvataggio

↓

Aggiornamento

---

## FLUSSO 04

Chiusura popup.

Tap fuori popup

↓

Popup chiuso

↓

Nessun salvataggio

↓

Perdita modifiche

---

## FLUSSO 05

Eliminazione.

Espansione card

↓

Tap "Cancella impegno"

↓

Eliminazione immediata

↓

Aggiornamento calendario

↓

Aggiornamento lista

---

# 13. Edge Case

Questa sezione raccoglie tutti i casi particolari.

---

## EC-001

Giorno con tre eventi.

Risultato:

Non permettere ulteriori inserimenti.

Messaggio:

Massimo 3 eventi.

---

## EC-002

Evento senza orario

Risultato:
Mostrare "/" al posto dell'orario, come da mockup.

---

## EC-003

Due eventi con stesso orario.

Risultato:

Ordine di creazione.

---

## EC-004

Orario non valido.

Risultato:

Campo evidenziato come errore.

Pulsante "+" disabilitato.

---

## EC-005

Cambio mese con popup aperto.

Risultato:

Popup chiuso.

---

## EC-006

Eliminazione ricorrenza.

Risultato:

Eliminare tutta la serie.

---

## EC-007

31 di ogni mese.

Nei mesi con meno giorni.

Risultato:

Ultimo giorno disponibile.

---

## EC-008

29 Febbraio annuale.

Anno non bisestile.

Risultato:

Evento non creato.

---

# 14. User Experience

Ogni scelta deve rispettare queste regole.

---

L'utente non deve mai chiedersi:

"Cosa devo fare adesso?"

Ogni schermata deve risultare intuitiva.

---

Ogni operazione principale deve richiedere massimo tre tocchi.

---

Le animazioni non devono rallentare l'utilizzo.

Devono dare solamente una sensazione di fluidità.

---

L'app deve poter essere utilizzata con una mano.

---

Tutti i pulsanti devono essere facilmente raggiungibili.

---

Mai utilizzare popup sopra altri popup.

---

Mai utilizzare schermate inutili.

---

Mai chiedere conferme non necessarie.

---

# 15. Regole di sviluppo

Questo documento rappresenta la fonte ufficiale del progetto.

Ogni modifica futura dovrà rispettare quanto riportato.


---


# 16. Roadmap

Versione 0.1

- struttura progetto
- Home

---

Versione 0.2

- calendario funzionante

---

Versione 0.3

- popup

---

Versione 0.4

- eventi

---

Versione 0.5

- database locale

---

Versione 0.6

- ricorrenze

---

Versione 0.7

- notifiche

---

Versione 1.0

Applicazione completa.

---

# 17. Convenzioni di sviluppo

Queste convenzioni devono essere rispettate durante tutto il progetto.

Lo scopo è mantenere il codice ordinato, leggibile e facilmente modificabile.

---

## HTML

Utilizzare HTML semantico quando possibile.

Esempi:

<header>

<main>

<section>

<footer>

Evitare div inutili.

Ogni elemento deve avere uno scopo preciso.

---

## CSS

Utilizzare variabili CSS per:

- colori
- radius
- ombre
- animazioni
- spaziature

Non scrivere valori duplicati.

Esempio corretto:

background: var(--purple);

Non:

background: #530FE8;

---

Le classi devono avere nomi semplici.

Esempi:

calendar-grid

event-card

popup-overlay

month-title

Non utilizzare abbreviazioni difficili da capire.

---

## JavaScript

Ogni file deve avere una responsabilità precisa.

index.html

↓

Struttura

style.css

↓

Grafica

calendar.js

↓

Calendario

events.js

↓

Gestione eventi

storage.js

↓

Salvataggio dati

notifications.js

↓

Notifiche

app.js

↓

Coordinamento generale

---

Mai creare funzioni duplicate.

Ogni funzione deve avere un solo compito.

---

# 18. Decisioni progettuali

Questa sezione raccoglie tutte le decisioni prese durante la progettazione.

Serve per ricordare il motivo delle scelte effettuate.

---

Decisione 001

Nessun login.

Motivazione:

Applicazione personale.

---

Decisione 002

Nessun cloud.

Motivazione:

Offline First.

---

Decisione 003

Massimo tre eventi per giorno.

Motivazione:

Interfaccia pulita.

---

Decisione 004

Nessun pulsante "+" fisso.

Motivazione:

L'utente crea sempre l'evento partendo dal giorno.

---

Decisione 005

Popup invece di nuove schermate.

Motivazione:

Ridurre i tocchi necessari.

---

Decisione 006

Tema esclusivamente scuro.

Motivazione:

Coerenza grafica.

---

Decisione 007

Solo italiano.

Motivazione:

Applicazione personale.

---

Decisione 008

Nessun autosalvataggio.

Motivazione:

L'utente controlla sempre quando salvare.

---

Decisione 009

Nessuna conferma per eliminare.

Motivazione:

Velocizzare il flusso.

---

Decisione 010

Progetto ottimizzato prima per iPhone.

Motivazione:

Dispositivo principale.

---

# 19. Checklist sviluppo

Questa checklist serve a verificare ogni versione.

---

Versione 0.1

□ Struttura progetto

□ Home

□ Design System

□ Responsive

---

Versione 0.2

□ Calendario

□ Cambio mese

□ Giorno corrente

□ Indicatori eventi

---

Versione 0.3

□ Popup

□ Overlay

□ Apertura

□ Chiusura

---

Versione 0.4

□ Creazione evento

□ Modifica

□ Eliminazione

---

Versione 0.5

□ IndexedDB

□ Caricamento

□ Salvataggio

---

Versione 0.6

□ Ricorrenze

□ Aggiornamento automatico

---

Versione 0.7

□ Notifiche

---

Versione 1.0

□ PWA

□ Offline

□ Manifest

□ Service Worker

□ Test finale

---

# 20. Possibili sviluppi futuri

Queste funzionalità NON fanno parte della versione 1.0.

Potranno essere valutate successivamente.

- esportazione dati

- importazione dati

- widget

- statistiche

- ricerca eventi

- tema personalizzato

Attualmente non devono essere implementate.

---

# 22. Obiettivo del progetto

L'obiettivo non è semplicemente creare un calendario.

L'obiettivo è creare un'applicazione personale che dia la sensazione di utilizzare un'app nativa Apple.

Ogni dettaglio dovrà contribuire a questa sensazione.

La semplicità avrà sempre priorità sul numero di funzionalità.

La qualità avrà sempre priorità sulla velocità di sviluppo.

---

# APPENDICE A - Architettura tecnica

Questa appendice descrive il funzionamento interno dell'applicazione.

Lo scopo è mantenere un'architettura pulita, prevedibile e facilmente estendibile.

---

# A.1 Filosofia del codice

Ogni file deve avere una sola responsabilità.

Nessun file dovrà contenere logiche appartenenti ad altri moduli.

L'obiettivo è poter modificare una funzionalità senza compromettere il resto dell'app.

---

# A.2 Responsabilità dei file

## index.html

Contiene esclusivamente la struttura HTML.

Non contiene logica.

---

## style.css

Contiene tutta la grafica.

Colori.

Layout.

Animazioni.

Responsive.

---

## app.js

Punto di ingresso dell'app.

Inizializza l'applicazione.

Collega i vari moduli.

---

## calendar.js

Generazione del calendario.

Cambio mese.

Disegno giorni.

Aggiornamento indicatori eventi.

---

## events.js

Creazione evento.

Modifica evento.

Eliminazione evento.

Popup.

Validazione input.

---

## storage.js

Gestione IndexedDB.

Salvataggio.

Lettura.

Aggiornamento.

Eliminazione.

---

## notifications.js

Gestione notifiche.

Richiesta permessi.

Programmazione notifiche.

---

# A.3 Struttura di un evento

Ogni evento sarà rappresentato da un oggetto.

```javascript
{
    id,

    date,

    title,

    time,

    priority,

    recurrence,

    createdAt
}
```

## Significato

id

Identificatore univoco.

---

date

Formato:

YYYY-MM-DD

Esempio:

2026-08-14

---

title

Nome evento.

---

time

Formato

HH:mm

oppure

null

---

priority

Valori possibili

high

medium

low

---

recurrence

Valori possibili

none

weekly

monthly

yearly

---

createdAt

Data di creazione.

Serve anche per ordinare eventi con stesso orario.

---

# A.4 Ordinamento eventi

Ordine:

1. Data

2. Orario

3. createdAt

Gli eventi senza orario vengono sempre dopo quelli con orario.

---

# A.5 Generazione calendario

Il calendario viene generato dinamicamente.

Non esistono pagine HTML differenti per ogni mese.

Ogni volta che cambia il mese viene rigenerata solamente la griglia.

---

# A.6 Aggiornamento interfaccia

Ogni operazione aggiorna automaticamente:

- calendario
- prossimi impegni
- popup (se necessario)

Senza ricaricare la pagina.

---

# A.7 IndexedDB

Un solo database.

Una sola Object Store.

Nome consigliato:

events

Ogni evento occupa un record.

---

# A.8 Notifiche

Le notifiche verranno implementate nella versione 0.7.

Regole previste:

- una notifica per evento
- solo se presente un orario
- nessuna notifica per eventi senza orario

---

# A.9 Prestazioni

L'app deve essere istantanea.

Obiettivi:

Apertura popup

< 150 ms

Cambio mese

< 200 ms

Creazione evento

< 100 ms

Eliminazione

< 100 ms

---

# A.10 Compatibilità

Piattaforma principale

iPhone (Safari)

Compatibilità secondaria

Android

Desktop utilizzato solo per sviluppo.

---

# APPENDICE B - Convenzioni future

Quando verrà richiesta una nuova funzione:

1.

Valutare se rispetta la filosofia del progetto.

2.

Verificare se modifica il comportamento già definito.

3.

Aggiornare prima questo documento.

4.

Solo dopo modificare il codice.

---

# APPENDICE C - Regole definitive del progetto

Le seguenti regole non devono cambiare senza una precisa decisione progettuale.

✓ Offline First

✓ Nessun cloud

✓ Nessun login

✓ Nessuna sincronizzazione

✓ Solo italiano

✓ Solo Dark Mode

✓ Solo tre priorità

✓ Solo tre ricorrenze

✓ Massimo tre eventi al giorno

✓ Nessun autosalvataggio

✓ Nessuna conferma eliminazione

✓ Popup invece di nuove schermate

✓ Home come unica schermata principale

✓ Esperienza il più possibile simile ad un'app nativa Apple

---
# Definizione di completamento

Una funzionalità è considerata completata solo se:

- rispetta lo SPEC;
- rispetta il mockup Figma;
- non introduce regressioni;
- mantiene la filosofia del progetto;
- funziona offline;
- è coerente con l'esperienza di un'app nativa Apple.

