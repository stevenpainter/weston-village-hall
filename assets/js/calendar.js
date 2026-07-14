/**
 * calendar.js — Accessible, navigable events calendar
 *
 * Renders a month-grid calendar from event data embedded in the page
 * (no network requests — all events were fetched from Sanity at build time).
 *
 * GDS principles applied:
 * - Semantic <table> with <caption>, scoped column headers, and a <button>
 *   per interactive day so the whole grid works with keyboard and screen readers
 * - aria-live region announces the month when navigating
 * - Selecting a day shows its events in a panel below, with links that jump to
 *   (and focus) the matching event card already rendered on the page —
 *   the calendar never re-renders event content itself, just points to it
 */

(function () {
  'use strict';

  const root = document.getElementById('calendar');
  if (!root) return;

  const dataEl = document.getElementById('calendar-events-data');
  const gridBody = document.getElementById('calendar-body');
  const caption = document.getElementById('calendar-caption');
  const monthLabel = document.getElementById('calendar-month-label');
  const prevBtn = document.getElementById('calendar-prev');
  const nextBtn = document.getElementById('calendar-next');
  const todayBtn = document.getElementById('calendar-today');
  const dayEventsPanel = document.getElementById('calendar-day-events');

  if (!dataEl || !gridBody || !monthLabel || !prevBtn || !nextBtn || !dayEventsPanel) return;

  let events = [];
  try {
    events = JSON.parse(dataEl.textContent);
  } catch (e) {
    return;
  }

  // Group events by local YYYY-MM-DD date key
  const eventsByDay = {};
  events.forEach((evt) => {
    const d = new Date(evt.date);
    if (isNaN(d)) return;
    const key = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
    if (!eventsByDay[key]) eventsByDay[key] = [];
    eventsByDay[key].push(evt);
  });

  function dateKey(year, month, day) {
    return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
  }

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedKey = null;

  function render() {
    monthLabel.textContent = MONTH_NAMES[viewMonth] + ' ' + viewYear;
    if (caption) caption.textContent = 'Events calendar — ' + MONTH_NAMES[viewMonth] + ' ' + viewYear;

    gridBody.innerHTML = '';

    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    // Monday-first: shift so Monday = 0 ... Sunday = 6
    const firstWeekday = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    let date = 1;
    let nextMonthDate = 1;
    const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

    for (let row = 0; row < totalCells / 7; row++) {
      const tr = document.createElement('tr');

      for (let col = 0; col < 7; col++) {
        const cellIndex = row * 7 + col;
        const td = document.createElement('td');

        if (cellIndex < firstWeekday) {
          // Padding from previous month — not interactive
          td.className = 'calendar__cell calendar__cell--outside';
        } else if (date > daysInMonth) {
          td.className = 'calendar__cell calendar__cell--outside';
          nextMonthDate++;
        } else {
          const key = dateKey(viewYear, viewMonth, date);
          const dayEvents = eventsByDay[key] || [];
          const isToday = key === dateKey(today.getFullYear(), today.getMonth(), today.getDate());

          td.className = 'calendar__cell';

          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'calendar__day' + (dayEvents.length ? ' calendar__day--has-events' : '');
          if (key === selectedKey) btn.classList.add('is-selected');
          if (isToday) btn.setAttribute('aria-current', 'date');

          const label = date + ' ' + MONTH_NAMES[viewMonth] + ' ' + viewYear +
            (dayEvents.length ? ' — ' + dayEvents.length + (dayEvents.length === 1 ? ' event' : ' events') : ' — no events');
          btn.setAttribute('aria-label', label);

          btn.innerHTML = '<span aria-hidden="true">' + date + '</span>' +
            (dayEvents.length ? '<span class="calendar__dot" aria-hidden="true"></span>' : '');

          btn.addEventListener('click', () => {
            selectedKey = key;
            showDayEvents(key, dayEvents, date);
            render();
            // Keep focus on the same day button after re-render
            const reselected = gridBody.querySelector('.calendar__day.is-selected');
            if (reselected) reselected.focus();
          });

          td.appendChild(btn);
          date++;
        }

        tr.appendChild(td);
      }

      gridBody.appendChild(tr);
    }
  }

  function showDayEvents(key, dayEvents, dayNum) {
    if (!dayEvents.length) {
      dayEventsPanel.innerHTML = '<p>No events on ' + dayNum + ' ' + MONTH_NAMES[viewMonth] + '.</p>';
      return;
    }

    const heading = document.createElement('h3');
    heading.className = 'calendar__day-events-heading';
    heading.textContent = dayEvents.length === 1 ? '1 event' : dayEvents.length + ' events';

    const list = document.createElement('ul');
    list.setAttribute('role', 'list');
    list.className = 'calendar__day-events-list';

    dayEvents.forEach((evt) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#event-' + evt.id;
      const time = new Date(evt.date).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' });
      link.textContent = evt.title + ' — ' + time;

      link.addEventListener('click', (e) => {
        const target = document.getElementById('event-' + evt.id);
        if (target) {
          e.preventDefault();
          // Past events live inside a closed <details> — open it first,
          // otherwise the target can't be scrolled to or focused
          const detailsAncestor = target.closest('details');
          if (detailsAncestor) detailsAncestor.open = true;
          target.setAttribute('tabindex', '-1');
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.focus();
        }
      });

      li.appendChild(link);
      list.appendChild(li);
    });

    dayEventsPanel.innerHTML = '';
    dayEventsPanel.appendChild(heading);
    dayEventsPanel.appendChild(list);
  }

  prevBtn.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    selectedKey = null;
    dayEventsPanel.innerHTML = '';
    render();
  });

  nextBtn.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    selectedKey = null;
    dayEventsPanel.innerHTML = '';
    render();
  });

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      viewYear = today.getFullYear();
      viewMonth = today.getMonth();
      selectedKey = null;
      dayEventsPanel.innerHTML = '';
      render();
    });
  }

  render();
}());
