const DB_NAME = "CalendarioDB";
const DB_VERSION = 1;
const STORE_NAME = "events";

let dbInstance = null;

export function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("date", "date", { unique: false });
        store.createIndex("groupId", "groupId", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function getAllEvents() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function saveEvent(eventData) {
  const db = await openDB();
  
  // Se stiamo modificando un evento esistente con un groupId, puliamo la vecchia serie prima di salvarne una nuova
  if (eventData.id) {
    const existing = await getEventById(eventData.id);
    if (existing && existing.groupId) {
      await deleteGroupEvents(existing.groupId);
    } else {
      await deleteEvent(eventData.id);
    }
  }

  // Parse sicuro della data senza problemi di fuso orario UTC/Timezone
  const parts = eventData.date.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // I mesi in JS vanno da 0 a 11
  const day = parseInt(parts[2], 10);

  const recurrenceGroup = (eventData.id || Date.now().toString()) + "_group";
  const datesToCreate = [eventData.date];

  if (eventData.recurrence === 'weekly') {
    for (let i = 1; i <= 52; i++) {
      const d = new Date(year, month, day + (i * 7));
      datesToCreate.push(formatDate(d));
    }
  } else if (eventData.recurrence === 'monthly') {
    for (let i = 1; i <= 12; i++) {
      const d = new Date(year, month + i, day);
      datesToCreate.push(formatDate(d));
    }
  } else if (eventData.recurrence === 'yearly') {
    for (let i = 1; i <= 3; i++) {
      const d = new Date(year + i, month, day);
      datesToCreate.push(formatDate(d));
    }
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const baseId = eventData.id || Date.now().toString();

    datesToCreate.forEach((dateStr, idx) => {
      const newEv = {
        ...eventData,
        id: idx === 0 ? baseId : `${baseId}_rec_${idx}`,
        date: dateStr,
        groupId: eventData.recurrence !== 'none' ? recurrenceGroup : null
      };
      store.put(newEv);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function getEventById(id) {
  const db = await openDB();
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

export async function deleteEvent(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteGroupEvents(groupId) {
  const db = await openDB();
  const allEvents = await getAllEvents();
  const toDelete = allEvents.filter(e => e.groupId === groupId);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    toDelete.forEach(e => {
      store.delete(e.id);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}