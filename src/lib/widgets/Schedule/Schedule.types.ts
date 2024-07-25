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