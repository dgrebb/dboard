<script lang="ts">
  import FlyTransition from '$components/Transitions/FlyTransition.svelte';
  import { timeState } from '$stores';
  import type {
    CalendarEvent,
    ScheduleItem,
    ScheduleSettingsType,
  } from '$types';
  import { formatDateShort, formatMinutesToDuration } from '$utils';
  import { onMount } from 'svelte';
  import type { Action } from 'svelte/action';
  import { fade } from 'svelte/transition';
  import scheduleSettings from '$widgets/Schedule/schedule.settings.json';
  import './schedule.css';
  import ScheduleSettings from './ScheduleSettings.svelte';
  import Icon from '@iconify/svelte';

  // Create calendar widget state
  const createScheduleWidget = () => {
    let calendarState: CalendarEvent[] = $state([]);
    let settingsState: ScheduleSettingsType = $state(scheduleSettings);

    return {
      events: () => calendarState,
      setEvents: (events: CalendarEvent[]) => {
        calendarState = events;
      },
      settings: () => {
        return settingsState;
      },
      updateSettings: (settings: ScheduleSettingsType) => {
        settingsState = settings;
      },
      setCalendarDisplay: (calendar: number, display: boolean) => {
        settingsState.calendars[calendar].display = display;
      },
      getCalendarDisplay: (name: string) => {
        const calendarSettings = settingsState.calendars.find(
          (calendar) => calendar.id === name
        );

        if (calendarSettings) {
          return calendarSettings.display;
        }

        return true;
      },
    };
  };

  const scheduleWidget = createScheduleWidget();

  // Zoom level and current page stores
  let zoomLevel = $state(1);
  let events = $state(scheduleWidget.events());
  let settings = $state(scheduleWidget.settings());
  const settingsKey = 'dboardScheduleSettings';
  let loadedSettings = $state(false);

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

  let displayWidgetSettings = $state(false);

  const zoomIn = () => {
    zoomLevel = Math.min(zoomLevel + 0.1, 2);
  };

  const zoomOut = () => {
    zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
  };

  const nextPage = () => {
    dateChangeDirection = 'forward';
    currentPage = currentPage + 1;
  };

  const todayPage = () => {
    dateChangeDirection = currentPage > 0 ? 'backward' : 'forward';
    currentPage = 0;
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

  const toggleWidgetSettings = (event: TouchEvent | MouseEvent) => {
    event.stopPropagation();
    displayWidgetSettings = !displayWidgetSettings;
  };

  const calculateEventPosition = (
    event: CalendarEvent
  ): { top: number; height: number } => {
    const start = parseTime(event.start_at);
    const end = parseTime(event.end_at);
    const top = start.hours * 60 + start.minutes;
    const height =
      (end.hours - start.hours) * 60 + (end.minutes - start.minutes);

    return {
      top,
      height,
    };
  };

  const parseTime = (
    timeString: string | null
  ): { hours: number; minutes: number } => {
    if (!timeString) {
      return { hours: 0, minutes: 0 }; // Default to 00:00 if timeString is null or undefined
    }
    let hours = 0,
      minutes = 0;

    // Check if the time string ends with 'am' or 'pm'
    const is12HourFormat = /am|pm/i.test(timeString);

    if (is12HourFormat) {
      // Extract time and modifier
      let [time, modifier] = [timeString.slice(0, -2), timeString.slice(-2)];
      [hours, minutes] = time.split(':').map(Number);

      // Adjust hours based on am/pm
      if (modifier.toLowerCase() === 'pm' && hours < 12) hours += 12;
      if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;
    } else {
      // Assume 24-hour format
      [hours, minutes] = timeString.split(':').map(Number);
    }

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

  const getSettings = async () => {
    const settingsString = localStorage.getItem(settingsKey);
    if (settingsString) {
      scheduleWidget.updateSettings(JSON.parse(settingsString));
    }
    loadedSettings = true;
  };

  $effect(() => {
    events = scheduleWidget.events();
  });

  $effect(() => {
    if (loadedSettings) {
      settings = scheduleWidget.settings();
      let settingsString = JSON.stringify(settings);
      localStorage.setItem(settingsKey, settingsString);
    }
  });

  $effect(() => {
    quarter = timeState.quarter();
    events = scheduleWidget.events();
  });

  onMount(async () => {
    const data = await fetch('/api/static/calendar?range=rolling15').then(
      (res) => res.json()
    );
    scheduleWidget.setEvents(data.events);
    await getSettings();
  });
</script>

<div class="dboard__grid__item schedule push-to-refresh">
  {#if displayWidgetSettings === false}
    <div class="dboard__card" transition:fade>
      <div class="controls">
        {#key date}
          <button onclick={todayPage} class="schedule-widget-date"
            ><h1
              class="text-white mix-blend-exclusion"
              in:fade={{ duration: 111, delay: 111 }}
              out:fade={{ duration: 111 }}
            >
              {formatDateShort(date)}
            </h1></button
          >
        {/key}
        <div class="zoom-controls">
          <button onclick={zoomOut}>&#8722;</button><button onclick={zoomIn}
            >&#43;</button
          >
        </div>
        <div class="navigation-controls">
          <button onclick={prevPage} class="date-back"
            ><span class="rotate-180">&#10132;</span></button
          ><button onclick={nextPage} class="date-forward"
            ><span>&#10132;</span></button
          >
        </div>
      </div>
      <div
        class="schedule-container"
        ontouchstart={handleTouchStart}
        ontouchend={handleTouchEnd}
      >
        <FlyTransition
          transitionKey={scheduleItems}
          direction={dateChangeDirection}
        >
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
              {#if event && scheduleWidget.getCalendarDisplay(event.calendar) === true}
                <div
                  class="event border-10 border-blue-600"
                  data-calendar-name={event.calendar}
                  style="top: {event.top * zoomLevel}px; height: {event.height *
                    zoomLevel}px;"
                >
                  <h2 class="title">
                    {event.title}
                  </h2>
                  <h3 class="start">{event.start_at}</h3>
                  <ul class="event-details">
                    <li class="duration">
                      {formatMinutesToDuration(event.duration)}
                    </li>
                    <li class="times">
                      {event.start_at} &rarr; {event.end_at}
                    </li>
                    <li class="calendar">{event.calendar}</li>
                  </ul>
                </div>
              {/if}
            {/each}
          </div>
        </FlyTransition>
      </div>
    </div>
  {/if}
  {#if displayWidgetSettings === true}
    <ScheduleSettings bind:settings />
  {/if}
  <button class="settings-toggle" onclick={toggleWidgetSettings}
    ><Icon icon="fluent:settings-16-filled" /></button
  >
</div>
