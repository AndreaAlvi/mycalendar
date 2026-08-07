import { getAllEvents, deleteEvent } from "./storage.js";

const DAY_NAMES = ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"];

function formatBadgeDate(dateStr) {
  const dateObj = new Date(dateStr + "T00:00:00");
  const dayName = DAY_NAMES[dateObj.getDay()];
  const dayNum = dateObj.getDate();
  return { dayName, dayNum };
}

function createEventCard(event, onRefresh) {
  const card = document.createElement("li");
  card.className = `event-card priority-${event.priority}`;
  card.dataset.id = event.id;

  const { dayName, dayNum } = formatBadgeDate(event.date);

  card.innerHTML = `
    <div class="event-card-main">
      <div class="event-date-badge">
        <span>${dayName}</span>
        <span>${dayNum}</span>
      </div>
      <span class="event-name">${event.title}</span>
      <span class="event-time">${event.time || "/"}</span>
    </div>
    <div class="event-card-actions">
      <button type="button" class="btn-inline-delete">Cancella impegno</button>
    </div>
  `;

  // Toggle espansione card al click
  card.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-inline-delete")) return;
    card.classList.toggle("expanded");
  });

  // Azione eliminazione diretta
  const deleteBtn = card.querySelector(".btn-inline-delete");
  deleteBtn.addEventListener("click", async (e) => {
  e.stopPropagation();

  const conferma = confirm("Vuoi eliminare questo evento?");

  if (!conferma) {
    return;
  }

  try {
    const card = e.currentTarget.closest(".event-card");

if (card) {

  await card.animate(
    [
      {
        opacity: 1,
        transform: "scale(1)"
      },
      {
        opacity: 0,
        transform: "scale(0.96)"
      }
    ],
    {
      duration: 180,
      easing: "ease-in",
      fill: "forwards"
    }
  ).finished;

}

await deleteEvent(event.id);

if (onRefresh) {
  await onRefresh();
}

  } catch (error) {
    console.error(error);
    alert("Si è verificato un errore durante l'eliminazione dell'evento.");
  }
});

  return card;
}

export async function renderUpcomingEvents(containerEl, onRefresh, visibleDate = new Date()) {
  if (!containerEl) return;

  try {
    const events = await getAllEvents();
    const fragment = document.createDocumentFragment();

    // Data odierna in formato YYYY-MM-DD
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // Anno e mese attualmente visualizzati nel calendario
    const visibleYear = visibleDate.getFullYear();
    const visibleMonthStr = String(visibleDate.getMonth() + 1).padStart(2, "0");
    const visibleYearMonth = `${visibleYear}-${visibleMonthStr}`;

    // Filtriamo gli eventi:
    // 1. Devono appartenere al mese/anno correntemente visualizzato
    // 2. La data dell'evento deve essere >= a oggi
    const filteredEvents = events.filter((ev) => {
      const isSameMonth = ev.date.startsWith(visibleYearMonth);
      const isUpcomingOrToday = ev.date >= todayStr;
      return isSameMonth && isUpcomingOrToday;
    });

    filteredEvents.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return (a.time || "").localeCompare(b.time || "");
    });

    const upcoming = filteredEvents;

    if (upcoming.length === 0) {
      const emptyMsg = document.createElement("li");
      emptyMsg.style.color = "var(--muted-text)";
      emptyMsg.style.textAlign = "center";
      emptyMsg.style.padding = "20px 0";
      emptyMsg.style.listStyle = "none";
      emptyMsg.textContent = "Nessun impegno in programma";
      fragment.append(emptyMsg);
    } else {
      upcoming.forEach((event) => {
        fragment.append(createEventCard(event, onRefresh));
      });
    }

    containerEl.replaceChildren(fragment);
  } catch (err) {
    console.error("Errore nel rendering dei prossimi impegni:", err);
  }
}