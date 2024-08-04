export interface CalendarEvent {
  left: number;
  width: number;
  height: number;
  top: number;
  title: string;
  calendar: string;
  date: string;
  notes: string;
  start_at: string;
  end_at: string;
  duration: number;
  urls: string[];
}

export type ScheduleItem = CalendarEvent & {
  top: number;
  height: number;
  width: number;
  left: number;
};

export interface CalendarSettings {
  id: string;
  display: boolean;
  scheduledDisplay: {
    on: string; // Time format "HH:MM"
    off: string; // Time format "HH:MM"
  };
}

/**
 * Type representing an array of Schedule readings.
 */
export type ScheduleData = CalendarEvent[];

/**
 * Type representing a Schedule widget.
 */
export interface ScheduleWidget {
  type: 'Schedule';
  data: ScheduleData;
}

export interface ScheduleSettingsType {
  calendars: CalendarSettings[];
}
