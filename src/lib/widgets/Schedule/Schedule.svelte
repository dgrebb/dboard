<script lang="ts">
  import FlyTransition from '$components/Transitions/FlyTransition.svelte';
  import { timeState } from '$stores';
  import type { CalendarEvent, ScheduleItem } from '$types';
  import { formatDateMMDD, formatMinutesToDuration } from '$utils';
  import { onMount } from 'svelte';
  import type { Action } from 'svelte/action';
  import './schedule.css';

  // Create calendar widget state
  const createCalendarWidget = () => {
    let calendarState: CalendarEvent[] = $state([]);

    return {
      events: () => calendarState,
      setEvents: (events: CalendarEvent[]) => {
        calendarState = events;
      },
    };
  };

  const calendarWidget = createCalendarWidget();

  // Zoom level and current page stores
  let zoomLevel = $state(1);
  let events = $state(calendarWidget.events());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let quarter = $state(timeState.quarter());
  let currentPage: number = $state(0);
  const today = new Date();

  let date = $derived(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + currentPage
    )
  );

  let currentEvents: CalendarEvent[] = $derived(
    events.filter((event) => {
      const eventDate = new Date(event.date + 'T00:00:00');
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    })
  );

  let scheduleItems: ScheduleItem[] = $derived(
    currentEvents.map((event) => {
      const { top, height } = calculateEventPosition(event);
      return { ...event, top, height };
    })
  );

  const zoomIn = () => {
    zoomLevel = Math.min(zoomLevel + 0.1, 2);
  };

  const zoomOut = () => {
    zoomLevel = Math.min(zoomLevel - 0.1, 0.5);
  };

  const nextPage = () => {
    dateChangeDirection = 'forward';
    currentPage = currentPage + 1;
  };

  const prevPage = () => {
    dateChangeDirection = 'backward';
    currentPage = currentPage - 1;
  };

  let startX = 0;
  let dateChangeDirection: 'forward' | 'backward' = $state('forward');

  const handleTouchStart = (event: TouchEvent) => {
    startX = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const endX = event.changedTouches[0].clientX;
    if (startX - endX > 50) {
      nextPage();
    } else if (endX - startX > 50) {
      prevPage();
    }
  };

  const calculateEventPosition = (
    event: CalendarEvent
  ): { top: number; height: number } => {
    const start = parseTime(event.start_at);
    const end = parseTime(event.end_at);

    return {
      top: start.hours * 60 + start.minutes,
      height: (end.hours - start.hours) * 60 + (end.minutes - start.minutes),
    };
  };

  const parseTime = (
    timeString: string | null
  ): { hours: number; minutes: number } => {
    if (!timeString) {
      return { hours: 0, minutes: 0 }; // Default to 00:00 if timeString is null or undefined
    }

    let [time, modifier] = [timeString.slice(0, -2), timeString.slice(-2)];
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'pm' && hours < 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const scrollToCurrentTime: Action = (node: HTMLElement) => {
    const now = new Date();
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
    if (node) {
      setTimeout(() => {
        node.scrollTo({
          behavior: 'smooth',
          left: 0,
          top: minutesSinceMidnight * zoomLevel,
        });
      }, 0);
    } else {
      console.log('Node not found');
    }
  };

  $effect(() => {
    events = calendarWidget.events();
  });

  $effect(() => {
    quarter = timeState.quarter();
    events = calendarWidget.events();
  });

  onMount(async () => {
    const data = await fetch('/api/static/calendar?range=rolling15').then(
      (res) => res.json()
    );
    calendarWidget.setEvents(data.events);
  });
</script>

<div class="dboard__grid__item schedule push-to-refresh">
  <div class="navigation-controls">
    <button onclick={prevPage} class="border-10 border-red-100">&lt;</button>
    <button onclick={nextPage} class="border-10 border-red-100">&gt;</button>
  </div>
  <div class="dboard__card">
    <div
      class="schedule-container"
      ontouchstart={handleTouchStart}
      ontouchend={handleTouchEnd}
    >
      <FlyTransition
        transitionKey={scheduleItems}
        direction={dateChangeDirection}
      >
        <div class="controls">
          <div class="zoom-controls">
            <button onclick={zoomIn}>Zoom In</button>
            <button onclick={zoomOut}>Zoom Out</button>
          </div>
          <h1 class="text-white mix-blend-exclusion">{formatDateMMDD(date)}</h1>
        </div>
        <div class="schedule-grid" use:scrollToCurrentTime>
          {#each Array.from({ length: 24 }, (_, i) => i) as i}
            <div class="time-block" style="height: {60 * zoomLevel}px;">
              <div class="time-label">{i}:00</div>
              <div
                class="quarter-block"
                style="height: {15 * zoomLevel}px;"
              ></div>
              <div
                class="quarter-block"
                style="height: {15 * zoomLevel}px;"
              ></div>
              <div
                class="quarter-block"
                style="height: {15 * zoomLevel}px;"
              ></div>
              <div
                class="quarter-block"
                style="height: {15 * zoomLevel}px;"
              ></div>
            </div>
          {/each}
          {#each scheduleItems as event}
            {#if event}
              <div
                class="event border-10 border-blue-600"
                style="top: {event.top * zoomLevel}px; height: {event.height *
                  zoomLevel}px;"
              >
                <h2 class="title">{event.title}</h2>
                <h3 class="start">{event.start_at}</h3>
                <ul class="event-details">
                  <li class="duration">
                    {formatMinutesToDuration(event.duration)}
                  </li>
                  <li class="times">{event.start_at} &rarr; {event.end_at}</li>
                  <li class="calendar">{event.calendar}</li>
                </ul>
              </div>
            {/if}
          {/each}
        </div>
      </FlyTransition>
    </div>
  </div>
</div>
