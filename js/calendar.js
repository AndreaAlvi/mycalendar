import { getAllEvents } from "./storage.js";

const MONTH_NAMES = [
  "Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
  "Lug", "Ago", "Set", "Ott", "Nov", "Dic"
];

let currentVisibleDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

export function getVisibleDate() {
  return currentVisibleDate;
}

function createDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getMondayFirstDayIndex(year, month) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

function isCurrentDate(day, year, month, today) {
  return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
}

export async function renderCalendar({ grid, title, visibleDate, today, animate, onDayClick }) {
  if (!grid || !title) return;

  const year = visibleDate.getFullYear();
  const month = visibleDate.getMonth();
  const firstDayIndex = getMondayFirstDayIndex(year, month);
  const numberOfDays = new Date(year, month + 1, 0).getDate();
  const fragment = document.createDocumentFragment();

  title.classList.remove("month-changing");

void title.offsetWidth;

title.textContent = `${MONTH_NAMES[month]} ${year}`;

title.classList.add("month-changing");

title.addEventListener(
  "animationend",
  () => {
    title.classList.remove("month-changing");
  },
  { once: true }
);

grid.setAttribute(
  "aria-label",
  `Giorni di ${MONTH_NAMES[month].toLowerCase()} ${year}`
);

  let events = [];
  try {
    events = await getAllEvents();
  } catch (err) {
    console.error("Errore caricamento eventi:", err);
  }

  const eventsByDate = {};
  events.forEach((ev) => {
    if (!eventsByDate[ev.date]) {
      eventsByDate[ev.date] = [];
    }
    eventsByDate[ev.date].push(ev);
  });

  for (let offset = 0; offset < firstDayIndex; offset += 1) {
    const emptyCell = document.createElement("li");
    emptyCell.className = "calendar-day empty";
    emptyCell.setAttribute("aria-hidden", "true");
    fragment.append(emptyCell);
  }

  for (let day = 1; day <= numberOfDays; day += 1) {
    const dayIndex = (firstDayIndex + day - 1) % 7;
    const dateKey = createDateKey(year, month, day);

    const calendarDay = document.createElement("li");
    calendarDay.className = "calendar-day";
    calendarDay.dataset.date = dateKey;
    calendarDay.setAttribute("aria-label", `${day} ${MONTH_NAMES[month]} ${year}`);

    const dayNumber = document.createElement("span");
    dayNumber.textContent = String(day);

    if (dayIndex >= 5) {
      calendarDay.classList.add("is-weekend");
    }

    if (isCurrentDate(day, year, month, today)) {
      calendarDay.classList.add("is-today");
    }

    const dayEvents = eventsByDate[dateKey] || [];
    if (dayEvents.length > 0) {
      calendarDay.classList.add(`priority-${dayEvents[0].priority || 'medium'}`);

      if (dayEvents.length >= 2) {
        calendarDay.classList.add(`second-priority-${dayEvents[1].priority || 'medium'}`);
      }

      if (dayEvents.length >= 3) {
        calendarDay.classList.add(`third-priority-${dayEvents[2].priority || 'medium'}`);
      }
    }

    calendarDay.addEventListener("click", () => {
      if (onDayClick) onDayClick(dateKey, dayEvents, calendarDay);
    });

    calendarDay.append(dayNumber);
    fragment.append(calendarDay);
  }

  grid.replaceChildren(fragment);

  if (animate) {
  grid.classList.remove("month-enter");

  void grid.offsetWidth;

  grid.classList.add("month-enter");

  grid.addEventListener(
    "animationend",
    () => {
      grid.classList.remove("month-enter");
    },
    { once: true }
  );
}
}

export function initializeCalendar(onDayClick, onMonthChange) {
  const grid = document.getElementById("calendarGrid");
  const title = document.getElementById("monthTitle");
  const previousButton = document.getElementById("prevMonthBtn");
  const nextButton = document.getElementById("nextMonthBtn");

  const today = new Date();

  const updateCalendar = (monthOffset, animate) => {
    if (monthOffset > 0) {
  grid.classList.remove("month-prev");
  grid.classList.add("month-next");
} else if (monthOffset < 0) {
  grid.classList.remove("month-next");
  grid.classList.add("month-prev");
}
    currentVisibleDate.setMonth(currentVisibleDate.getMonth() + monthOffset);
    renderCalendar({ grid, title, visibleDate: currentVisibleDate, today, animate, onDayClick });
    if (onMonthChange) onMonthChange();
  };

  const newPrevBtn = previousButton.cloneNode(true);
  const newNextBtn = nextButton.cloneNode(true);
  previousButton.parentNode.replaceChild(newPrevBtn, previousButton);
  nextButton.parentNode.replaceChild(newNextBtn, nextButton);

  newPrevBtn.addEventListener("click", () => updateCalendar(-1, true));
  newNextBtn.addEventListener("click", () => updateCalendar(1, true));
    // Swipe tra i mesi
  let touchStartX = 0;
  let touchEndX = 0;

  let isSwiping = false;

grid.addEventListener("touchstart", (event) => {
  isSwiping = false;
  touchStartX = event.changedTouches[0].screenX;
});

  grid.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].screenX;

    const distance = touchEndX - touchStartX;

// Evita cambi mese per movimenti troppo piccoli
if (Math.abs(distance) < 60) return;

isSwiping = true;

    if (distance < 0) {
      // Swipe verso sinistra → mese successivo
      updateCalendar(1, true);
    } else {
      // Swipe verso destra → mese precedente
      updateCalendar(-1, true);
    }
  });

  // Disegno immediato all'avvio
  renderCalendar({ grid, title, visibleDate: currentVisibleDate, today, animate: false, onDayClick });
}