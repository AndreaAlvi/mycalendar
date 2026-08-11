import { initializeCalendar, getVisibleDate } from "./calendar.js";
import { renderUpcomingEvents } from "./events.js";
import { saveEvent, deleteEvent, deleteGroupEvents } from "./storage.js";

const modal = document.getElementById("eventModal");
const modalCardsContainer = document.getElementById("modalCardsContainer");
const modalBackdrop = document.getElementById("modalBackdrop");


let currentDayEvents = [];
let currentSelectedDate = "";
let isAddingNewEvent = false;

import { renderCalendar } from "./calendar.js";

export async function refreshUI() {
  const grid = document.getElementById("calendarGrid");
  const title = document.getElementById("monthTitle");
  
  await renderCalendar({
    grid,
    title,
    visibleDate: getVisibleDate(),
    today: new Date(),
    animate: false,
    onDayClick
  });

  await renderUpcomingEvents(document.getElementById("upcomingEventsList"), refreshUI, getVisibleDate());
}

async function onDayClick(dateStr, eventsForDay, dayElement) {
  currentDayEvents = eventsForDay || [];
  currentSelectedDate = dateStr;
  isAddingNewEvent = false;

  renderModalCards();

  if (dayElement) {
    const dayRect = dayElement.getBoundingClientRect();
    const calendarRect = document.querySelector(".calendar").getBoundingClientRect();
    
    const topOffset = dayRect.bottom - calendarRect.top + 12;
    modalCardsContainer.style.marginTop = `${Math.max(10, topOffset)}px`;

    const dayCenterHorizontal = (dayRect.left + dayRect.width / 2) - calendarRect.left;
    modalCardsContainer.style.setProperty('--arrow-left', `${dayCenterHorizontal}px`);
  }

  modalBackdrop.style.pointerEvents = "auto"; // <-- RIGA AGGIUNTA QUI

  modalBackdrop.animate(
  [
    { opacity: 0 },
    { opacity: 1 }
  ],
  {
    duration: 180,
    easing: "ease-out",
    fill: "forwards"
  }
);
  modal.classList.add("is-open");
  const cards = modalCardsContainer.querySelectorAll(".modal-content");

cards.forEach((card, index) => {

  card.animate(
    [
      {
        opacity: 0,
transform: "translateY(10px) scale(0.985)"
      },
      {
        opacity: 1,
        transform: "translateY(0) scale(1)"
      }
    ],
    {
      duration: 280,
      delay: index * 20,
      easing: "cubic-bezier(0.22,1,0.36,1)",
      fill: "forwards"
    }
  );

});
}

function renderModalCards() {
  modalCardsContainer.innerHTML = "";

  const parts = currentSelectedDate.split("-");
  const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = dateObj.toLocaleDateString('it-IT', options);
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  if (isAddingNewEvent || currentDayEvents.length === 0) {
    const createCard = createCardElement({
      dateStr: currentSelectedDate,
      dateTitle: capitalizedDate,
      event: null,
      mode: 'create',
      showPlusBtn: false
    });
    modalCardsContainer.appendChild(createCard);
  }

  currentDayEvents.forEach((ev, index) => {
    const canAddMore = (currentDayEvents.length < 3) && !isAddingNewEvent;
    const showPlus = (index === 0) && canAddMore;

    const editCard = createCardElement({
      dateStr: currentSelectedDate,
      dateTitle: capitalizedDate,
      event: ev,
      mode: 'view',
      showPlusBtn: showPlus
    });
    modalCardsContainer.appendChild(editCard);
  });
}

function createCardElement({ dateTitle, event, mode, showPlusBtn }) {
  const card = document.createElement("div");
  const isCreate = mode === 'create';
  
  if (isCreate) {
    card.className = "modal-content mode-create";
  } else {
    card.className = `modal-content mode-edit priority-${event.priority || 'medium'}`;
  }

  const eventId = event ? event.id : "";
  const titleVal = event ? (event.title || "") : "";
  const timeVal = event ? (event.time || "") : "";
  const priorityVal = event ? (event.priority || "high") : "high";
  const recurrenceVal = event ? (event.recurrence || "none") : "none";
  const groupId = event ? event.groupId : null;
  const isDisabled = !isCreate ? "disabled" : "";

  card.innerHTML = `
    <div class="modal-header">
      <h2><span>${dateTitle}</span></h2>
      <div class="modal-header-actions">
        ${!isCreate ? `
          ${groupId ? `
            <button type="button" class="icon-btn action-circle btn-delete-group" title="Elimina tutte le ricorrenze">
              <span style="font-size: 11px; font-weight: bold; color: #ff453a;">ALL</span>
            </button>
          ` : ''}
          <button type="button" class="icon-btn action-circle btn-delete" title="Elimina questo evento">
            <img src="assets/icons/cestino.svg" alt="Elimina" />
          </button>
          <button type="button" class="icon-btn action-circle btn-edit" title="Modifica">
            <img src="assets/icons/edit.svg" alt="Modifica" />
          </button>
        ` : ''}
        ${showPlusBtn ? `
          <button type="button" class="icon-btn action-circle btn-add-more" title="Aggiungi altro impegno">
            <span style="font-size: 20px;">+</span>
          </button>
        ` : ''}
        ${isCreate ? `
          <button type="button" class="icon-btn action-circle btn-save" title="Salva">
            <span style="font-size: 20px;">+</span>
          </button>
        ` : ''}
      </div>
    </div>

    <form class="card-form">
      <input type="hidden" class="field-id" value="${eventId}" />
      
      <div class="form-group">
        <label>Evento:</label>
        <input type="text" class="field-title" placeholder="Nome evento..." value="${titleVal}" ${isDisabled} required />
      </div>

      <div class="form-group">
        <label>Orario:</label>
        <input type="text" class="field-time" inputmode="numeric" placeholder="--:--" value="${timeVal}" ${isDisabled} maxlength="5" />
      </div>

      <div class="form-group">
        <label>Priorità:</label>
        <div class="priority-selector ${isDisabled ? 'disabled' : ''}">
          <label class="priority-option low">
            <input type="radio" name="priority_${eventId || 'new'}" value="low" ${priorityVal === 'low' ? 'checked' : ''} ${isDisabled} />
            <span>BASSA</span>
          </label>
          <label class="priority-option medium">
            <input type="radio" name="priority_${eventId || 'new'}" value="medium" ${priorityVal === 'medium' ? 'checked' : ''} ${isDisabled} />
            <span>MEDIA</span>
          </label>
          <label class="priority-option high">
            <input type="radio" name="priority_${eventId || 'new'}" value="high" ${priorityVal === 'high' ? 'checked' : ''} ${isDisabled} />
            <span>ALTA</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>Ricorrenza:</label>
        <div class="recurrence-selector ${isDisabled ? 'disabled' : ''}">
          <label class="recurrence-option">
            <input type="radio" name="recurrence_${eventId || 'new'}" value="none" ${recurrenceVal === 'none' ? 'checked' : ''} ${isDisabled} />
            <span>NO</span>
          </label>
          <label class="recurrence-option">
            <input type="radio" name="recurrence_${eventId || 'new'}" value="weekly" ${recurrenceVal === 'weekly' ? 'checked' : ''} ${isDisabled} />
            <span>SETTIMANA</span>
          </label>
          <label class="recurrence-option">
            <input type="radio" name="recurrence_${eventId || 'new'}" value="monthly" ${recurrenceVal === 'monthly' ? 'checked' : ''} ${isDisabled} />
            <span>MESE</span>
          </label>
          <label class="recurrence-option">
            <input type="radio" name="recurrence_${eventId || 'new'}" value="yearly" ${recurrenceVal === 'yearly' ? 'checked' : ''} ${isDisabled} />
            <span>ANNO</span>
          </label>
        </div>
      </div>
    </form>
  `;

  const titleInput = card.querySelector(".field-title");

if (titleInput && !isDisabled) {

  titleInput.addEventListener("focus", () => {
    titleInput.placeholder = "";
  });

  titleInput.addEventListener("blur", () => {
    if (!titleInput.value.trim()) {
      titleInput.placeholder = "Nome evento...";
    }
  });

}
  const timeInput = card.querySelector(".field-time");
  if (timeInput && !isDisabled) {
    timeInput.addEventListener("focus", () => {
  timeInput.placeholder = "";

  if (timeInput.value === "--:--") {
    timeInput.value = "";
  }
});

    timeInput.addEventListener("blur", () => {
      let val = timeInput.value.trim();

if (!val) {
  timeInput.placeholder = "--:--";
  return;
}

      // Se l'utente scrive formati come "15.30", "15,30" o "15 30", li convertiamo in "15:30"
      if (/^\d{1,2}[.,\s-]\d{1,2}$/.test(val)) {
        const parts = val.split(/[.,\s-]/);
        const hours = parts[0].padStart(2, "0");
        const minutes = parts[1].padStart(2, "0");
        timeInput.value = `${hours}:${minutes}`;
        return;
      }

      // Se l'utente scrive solo 1 o 2 cifre (es. "9" o "15"), diventa "09:00" o "15:00"
      if (/^\d{1,2}$/.test(val)) {
        const hours = val.padStart(2, "0");
        timeInput.value = `${hours}:00`;
        return;
      } 

      // Se scrive 3 o 4 cifre senza separatore (es. "930" o "1530"), diventa "09:30" o "15:30"
      if (/^\d{3,4}$/.test(val)) {
        val = val.padStart(4, "0");
        timeInput.value = `${val.slice(0, 2)}:${val.slice(2, 4)}`;
        return;
      }
      // Controlliamo se l'orario è valido
const match = timeInput.value.match(/^(\d{2}):(\d{2})$/);

if (match) {
  const ore = parseInt(match[1], 10);
  const minuti = parseInt(match[2], 10);

  if (ore > 23 || minuti > 59) {
    timeInput.value = "";
    timeInput.placeholder = "--:--";
  }
}
    });
  }
  const btnEdit = card.querySelector(".btn-edit");
  const btnDelete = card.querySelector(".btn-delete");
  const btnDeleteGroup = card.querySelector(".btn-delete-group");
  const btnSave = card.querySelector(".btn-save");
  const btnAddMore = card.querySelector(".btn-add-more");

  if (btnEdit) {
    btnEdit.addEventListener("click", () => {
      card.className = "modal-content mode-create";
      
      // Sblocchiamo tutti gli input e rimuoviamo la classe disabled dai selettori
      const inputs = card.querySelectorAll("input");
      inputs.forEach(i => i.disabled = false);

      const selectors = card.querySelectorAll(".priority-selector, .recurrence-selector");
      selectors.forEach(s => s.classList.remove("disabled"));

      const actionsGroup = card.querySelector(".modal-header-actions");
      actionsGroup.innerHTML = "";

      const saveBtn = document.createElement("button");
      saveBtn.type = "button";
      saveBtn.className = "icon-btn action-circle btn-save";
      saveBtn.title = "Salva Modifiche";
      saveBtn.innerHTML = `<span style="font-weight: bold; font-size: 16px;">✓</span>`;
      saveBtn.addEventListener("click", () => handleSave(card));
      actionsGroup.appendChild(saveBtn);
    });
  }

  if (btnDelete) {
  btnDelete.addEventListener("click", async () => {

    const conferma = confirm("Vuoi eliminare questo evento?");

    if (!conferma) {
      return;
    }

    if (eventId) {
      await deleteEvent(eventId);
      closeModal();
      await refreshUI();
    }
  });
}

  if (btnDeleteGroup) {
    btnDeleteGroup.addEventListener("click", async () => {
      if (confirm("Vuoi davvero eliminare TUTTE le ricorrenze di questo evento?")) {
        await deleteGroupEvents(groupId);
        closeModal();
        await refreshUI();
      }
    });
  }

  if (btnSave) {
    btnSave.addEventListener("click", () => handleSave(card));
  }

  if (btnAddMore) {
    btnAddMore.addEventListener("click", () => {
      if (currentDayEvents.length >= 3) {
        alert("Hai raggiunto il limite massimo di 3 eventi per questo giorno.");
        return;
      }
      isAddingNewEvent = true;
      renderModalCards();
    });
  }

  return card;
}

async function handleSave(cardElement) {
  const titleInput = cardElement.querySelector(".field-title");
  const timeInput = cardElement.querySelector(".field-time");
  const idInput = cardElement.querySelector(".field-id");
  const priorityRadio = cardElement.querySelector(`input[type="radio"][name^="priority_"]:checked`);
  const recurrenceRadio = cardElement.querySelector(`input[type="radio"][name^="recurrence_"]:checked`);

  const titleVal = titleInput.value.trim();
  if (!titleVal) {
    alert("Inserisci un nome per l'evento!");
    return;
  }

  const id = idInput.value || Date.now().toString();
  const timeVal = timeInput.value.trim();
  // Controllo formato orario
if (timeVal !== "") {
  const match = timeVal.match(/^(\d{2}):(\d{2})$/);

  if (!match) {
    alert("Inserisci un orario valido (es. 09:30).");
    return;
  }

  const ore = parseInt(match[1], 10);
  const minuti = parseInt(match[2], 10);

  if (ore < 0 || ore > 23 || minuti < 0 || minuti > 59) {
    alert("L'orario inserito non è valido.");
    return;
  }
}
  const priorityVal = priorityRadio ? priorityRadio.value : "medium";
  const recurrenceVal = recurrenceRadio ? recurrenceRadio.value : "none";

  try {
  await saveEvent({
    id,
    date: currentSelectedDate,
    title: titleVal,
    time: timeVal,
    priority: priorityVal,
    recurrence: recurrenceVal
  });

  closeModal();
  await refreshUI();

} catch (error) {
  console.error(error);
  alert("Si è verificato un errore durante il salvataggio dell'evento.");
}
}

function closeModal() {

  const cards = modalCardsContainer.querySelectorAll(".modal-content");

  cards.forEach((card, index) => {

    card.animate(
      [
        {
          opacity: 1,
          transform: "translateY(0) scale(1)"
        },
        {
          opacity: 0,
          transform: "translateY(10px) scale(0.985)"
        }
      ],
      {
        duration: 240,
        delay: index * 15,
        easing: "ease-in",
        fill: "forwards"
      }
    );

  });

  modalBackdrop.animate(
    [
      { opacity: 1 },
      { opacity: 0 }
    ],
    {
      duration: 160,
      easing: "ease-in",
      fill: "forwards"
    }
  );

  setTimeout(() => {
    modal.classList.remove("is-open");
    modalBackdrop.style.pointerEvents = "none"; // <-- RIGA AGGIUNTA QUI
    isAddingNewEvent = false;
  }, 180);

}

modalBackdrop.addEventListener("click", closeModal);

document.addEventListener("DOMContentLoaded", () => {
  initializeCalendar(onDayClick, () => {
    renderUpcomingEvents(document.getElementById("upcomingEventsList"), refreshUI, getVisibleDate());
  });
  refreshUI();
});
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./service-worker.js");
      console.log("✅ Service Worker registrato");
    } catch (error) {
      console.error("❌ Errore registrazione Service Worker:", error);
    }
  });
}