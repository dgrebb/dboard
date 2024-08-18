<script lang="ts">
  import FlyTransition from '@components/Transitions/FlyTransition.svelte';
  import { timeState } from '@stores';
  import type {
    CalendarEvent,
    CalendarSettings,
    ScheduleItem,
    ScheduleSettingsType,
  } from '@types';
  import { formatDateShort, formatMinutesToDuration } from '@utils';
  import scheduleSettings from '@widgets/Schedule/schedule.settings.json';
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import type { Action } from 'svelte/action';
  import { fade } from 'svelte/transition';
  import './schedule.css';
  import ScheduleSettings from './ScheduleSettings.svelte';

  /**
   * Creates and manages the state of the schedule widget, including events and settings.
   * @returns {{events: () => CalendarEvent[], setEvents: (events: CalendarEvent[]) => void, settings: () => ScheduleSettingsType, updateSettings: (settings: ScheduleSettingsType) => void, setCalendarDisplay: (calendar: number, display: boolean) => void, getCalendarDisplay: (name: string) => boolean, setCalendarDisplaySchedule: (name: string, schedule: CalendarSettings['scheduledDisplay']) => void, getCalendarDisplaySchedule: (name: string) => CalendarSettings['scheduledDisplay']}}
   */
  const createScheduleWidget = () => {
    let calendarState: CalendarEvent[] = $state([]);
    let settingsState: ScheduleSettingsType = $state(scheduleSettings);

    return {
      events: () => calendarState,
      setEvents: (events: CalendarEvent[]) => {
        calendarState = events;
      },
      settings: () => settingsState,
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
        return calendarSettings ? calendarSettings.display : true;
      },
      setCalendarDisplaySchedule: (
        name: string,
        schedule: CalendarSettings['scheduledDisplay']
      ) => {
        const calendarSettings = settingsState.calendars.find(
          (calendar) => calendar.id === name
        );
        if (calendarSettings) {
          calendarSettings.scheduledDisplay = schedule;
          settingsState = {
            ...settingsState,
            calendars: settingsState.calendars.map((calendar) =>
              calendar.id === name ? calendarSettings : calendar
            ),
          };
        } else {
          console.error(
            `Couldn't set the ${name} calendar's display schedule.`
          );
        }
      },
      getCalendarDisplaySchedule: (name: string) => {
        const calendarSettings = settingsState.calendars.find(
          (calendar) => calendar.id === name
        );
        return calendarSettings
          ? calendarSettings.scheduledDisplay
          : { on: '00:00', off: '23:59' };
      },
    };
  };

  const scheduleWidget = createScheduleWidget();

  /** Zoom level for the calendar view */
  let zoomLevel = $state(1);
  /** Events currently displayed in the calendar */
  let events = $state(scheduleWidget.events());
  /** Current settings for the schedule widget */
  let settings = $state(scheduleWidget.settings());
  /** Key for storing settings in local storage */
  const settingsKey = 'dboardScheduleSettings';
  /** Flag to track if settings are loaded from storage */
  let loadedSettings = $state(false);

  /** Current quarter hour */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let quarter = $state(timeState.quarter());
  /** Index of the current page displayed in the calendar */
  let currentPage: number = $state(0);
  /** Today's date */
  const today = new Date();
  /** The date currently displayed on the calendar */
  let date = $derived(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + currentPage
    )
  );

  /**
   * Determines if a calendar should be displayed based on its schedule.
   * @param {CalendarSettings['scheduledDisplay']} scheduledDisplay - Schedule settings of the calendar
   * @returns {boolean} - True if the calendar should be displayed
   */
  const shouldDisplayCalendar = (
    scheduledDisplay: CalendarSettings['scheduledDisplay']
  ) => {
    const nowMinutes = timeState.minutesPastMidnight();
    const [onHours, onMinutes] = scheduledDisplay.on.split(':').map(Number);
    const [offHours, offMinutes] = scheduledDisplay.off.split(':').map(Number);

    const onMinutesTotal = onHours * 60 + onMinutes;
    const offMinutesTotal = offHours * 60 + offMinutes;

    return nowMinutes >= onMinutesTotal && nowMinutes <= offMinutesTotal;
  };

  /** List of current events filtered by display settings and date */
  let currentEvents = $derived(
    events.filter((event) => {
      const eventDate = new Date(event.date + 'T00:00:00');
      const calendarSettings = settings.calendars.find(
        (calendar) => calendar.id === event.calendar
      );
      return (
        calendarSettings?.display &&
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    })
  );

  /** Schedule items derived from current events with calculated positions */
  let scheduleItems = $derived(
    currentEvents.map((event) => {
      const { top, height } = calculateEventPosition(event);
      return { ...event, top, height };
    })
  );

  /** Flag to display the widget settings */
  let displayWidgetSettings = $state(false);

  /** Increases the zoom level */
  const zoomIn = () => {
    zoomLevel = Math.min(zoomLevel + 0.1, 2);
  };

  /** Decreases the zoom level */
  const zoomOut = () => {
    zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
  };

  /** Advances to the next page of the calendar */
  const nextPage = () => {
    dateChangeDirection = 'forward';
    currentPage += 1;
  };

  /** Returns to today's page */
  const todayPage = () => {
    dateChangeDirection = currentPage > 0 ? 'backward' : 'forward';
    currentPage = 0;
  };

  /** Goes to the previous page of the calendar */
  const prevPage = () => {
    dateChangeDirection = 'backward';
    currentPage -= 1;
  };

  /** Starting X position for touch events */
  let startX = 0;
  /** Direction of date change, either 'forward' or 'backward' */
  let dateChangeDirection: 'forward' | 'backward' = $state('forward');

  /**
   * Handles the start of a touch event
   * @param {TouchEvent} event - The touch start event
   */
  const handleTouchStart = (event: TouchEvent) => {
    startX = event.touches[0].clientX;
  };

  /**
   * Handles the end of a touch event
   * @param {TouchEvent} event - The touch end event
   */
  const handleTouchEnd = (event: TouchEvent) => {
    const endX = event.changedTouches[0].clientX;
    if (startX - endX > 50) {
      nextPage();
    } else if (endX - startX > 50) {
      prevPage();
    }
  };

  /**
   * Toggles the display of the widget settings
   * @param {TouchEvent | MouseEvent} event - The event triggering the toggle
   */
  const toggleWidgetSettings = (event: TouchEvent | MouseEvent) => {
    event.stopPropagation();
    displayWidgetSettings = !displayWidgetSettings;
  };

  /**
   * Calculates the position of an event in the schedule
   * @param {CalendarEvent} event - The event to calculate the position for
   * @returns {{top: number, height: number}} - The top and height positions
   */
  const calculateEventPosition = (
    event: CalendarEvent
  ): { top: number; height: number } => {
    const start = parseTime(event.start_at);
    const end = parseTime(event.end_at);
    const top = start.hours * 60 + start.minutes;
    const height =
      (end.hours - start.hours) * 60 + (end.minutes - start.minutes);
    return { top, height };
  };

  /**
   * Groups overlapping events together.
   * @param {CalendarEvent[]} events - List of events to group by overlap.
   * @returns {CalendarEvent[][]} - An array of event groups.
   */
  const groupOverlappingEvents = (
    events: CalendarEvent[]
  ): CalendarEvent[][] => {
    let groupedEvents: CalendarEvent[][] = [];
    let currentGroup: CalendarEvent[] = [];

    events.forEach((event, index) => {
      if (index === 0) {
        currentGroup.push(event);
      } else {
        const previousEvent = currentGroup[currentGroup.length - 1];
        const prevEnd = parseTime(previousEvent.end_at);
        const currentStart = parseTime(event.start_at);

        if (
          currentStart.hours < prevEnd.hours ||
          (currentStart.hours === prevEnd.hours &&
            currentStart.minutes < prevEnd.minutes)
        ) {
          currentGroup.push(event);
        } else {
          groupedEvents.push(currentGroup);
          currentGroup = [event];
        }
      }
    });

    if (currentGroup.length > 0) {
      groupedEvents.push(currentGroup);
    }

    return groupedEvents;
  };

  /**
   * Calculate the position and dimensions of each event for rendering.
   * @param {CalendarEvent[]} events - List of events.
   * @returns {CalendarEvent[]} - Events with updated position and dimension properties.
   */
  const calculateEventStyles = (events: unknown): ScheduleItem[] => {
    let groupedEvents = groupOverlappingEvents(events as ScheduleItem[]);

    groupedEvents.forEach((group) => {
      group.forEach((event, index) => {
        const { top, height } = calculateEventPosition(event);
        const width = 100 / group.length;
        const left = width * index;

        event.top = top;
        event.height = height;
        event.width = width;
        event.left = left;
      });
    });

    return events as ScheduleItem[];
  };

  /**
   * Draws the current time line based on the current time
   * @returns {number} - The position of the current time line
   */
  const drawCurrentTimeLine = () => {
    const now = new Date();
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
    return minutesSinceMidnight * zoomLevel;
  };

  /**
   * Parses a time string into hours and minutes
   * @param {string | null} timeString - The time string to parse
   * @returns {{hours: number, minutes: number}} - The parsed hours and minutes
   */
  const parseTime = (
    timeString: string | null
  ): { hours: number; minutes: number } => {
    if (!timeString) return { hours: 0, minutes: 0 };
    let [hours, minutes] = [0, 0];
    const is12HourFormat = /am|pm/i.test(timeString);

    if (is12HourFormat) {
      let [time, modifier] = [timeString.slice(0, -2), timeString.slice(-2)];
      [hours, minutes] = time.split(':').map(Number);
      if (modifier.toLowerCase() === 'pm' && hours < 12) hours += 12;
      if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;
    } else {
      [hours, minutes] = timeString.split(':').map(Number);
    }

    return { hours, minutes };
  };

  /**
   * Scrolls the schedule container to the current time
   * @type {Action}
   * @param {HTMLElement} node - The DOM node to scroll
   */
  const scrollToCurrentTime: Action = (node: HTMLElement) => {
    const now = new Date();
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
    if (node) {
      setTimeout(() => {
        node.scrollTo({
          behavior: 'smooth',
          left: 0,
          top: (currentPage === 0 ? minutesSinceMidnight : 480) * zoomLevel,
        });
      }, 0);
    }
  };

  /**
   * Fetches and applies the saved schedule settings from local storage
   */
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
    calculateEventStyles(events);
  });

  onMount(async () => {
    const data = await fetch('/api/static/calendar?range=rolling15').then(
      (res) => res.json()
    );
    scheduleWidget.setEvents(data.events);
    await getSettings();
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="dboard__grid__item schedule push-to-refresh" tabindex="0">
  {#if !displayWidgetSettings}
    <div class="dboard__card" transition:fade>
      <div class="controls">
        {#key date}
          <button onclick={todayPage} class="schedule-widget-date">
            <h1
              class="text-white mix-blend-exclusion"
              in:fade={{ duration: 111, delay: 111 }}
              out:fade={{ duration: 111 }}
            >
              {formatDateShort(date)}
            </h1>
          </button>
        {/key}
        <div class="zoom-controls">
          <button onclick={zoomOut}>&#8722;</button>
          <button onclick={zoomIn}>&#43;</button>
        </div>
        <div class="navigation-controls">
          <button onclick={prevPage} class="date-back"
            ><span class="rotate-180">&#10132;</span></button
          >
          <button onclick={nextPage} class="date-forward"
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
            {#key scheduleItems}
              {#each scheduleItems as event}
                {#if event && scheduleWidget.getCalendarDisplay(event.calendar) && shouldDisplayCalendar(scheduleWidget.getCalendarDisplaySchedule(event.calendar))}
                  <div
                    class="event border-10 border-blue-600"
                    data-calendar-name={event.calendar}
                    style="top: {event.top *
                      zoomLevel}px; height: {event.height *
                      zoomLevel}px; width: {event.width}%; left: {event.left}%;"
                  >
                    <h2 class="title">{event.title}</h2>
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
            {/key}
            {#if currentPage === 0}
              <div
                class="current-time-line"
                style="top: {drawCurrentTimeLine()}px;"
              ></div>
            {/if}
          </div>
        </FlyTransition>
      </div>
    </div>
  {/if}
  {#if displayWidgetSettings}
    <ScheduleSettings bind:settings />
  {/if}
  <button class="settings-toggle" onclick={toggleWidgetSettings}>
    <Icon icon="fluent:settings-16-filled" />
  </button>
</div>
