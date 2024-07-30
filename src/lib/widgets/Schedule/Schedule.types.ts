export type CalendarEvent = {
  title: string;
  calendar: string;
  date: string;
  notes: string;
  start_at: string;
  end_at: string;
  duration: number;
  urls: string[];
};

export type ScheduleItem = CalendarEvent & {
  top: number;
  height: number;
};

/**
 * Type representing an array of Schedule readings.
 */
export type ScheduleData = CalendarEvent[];

/**
 * Type representing a Schedule widget.
 */
export type ScheduleWidget = {
  type: 'Schedule';
  data: ScheduleData;
};

export type CalendarSettings = {
  id: string;
  display: boolean;
  scheduledDisplay: {
    on: string; // Time format "HH:MM"
    off: string; // Time format "HH:MM"
  };
};

export type ScheduleSettingsType = {
  calendars: CalendarSettings[];
};
