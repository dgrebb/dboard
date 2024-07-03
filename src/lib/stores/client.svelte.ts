import type { TimeZone } from '../types';

export const createUi = () => {
  const ui = $state({
    modal: false,
  });

  return {
    modal: () => {
      return ui.modal;
    },

    setModal: (state: boolean) => {
      ui.modal = state;
    },
  };
};

export const createTime = (initialTime: Date) => {
  let time = $state(initialTime);

  return {
    dateTime: () => {
      return time;
    },

    dateTimeString: (timeZone: TimeZone = 'America/New_York') => {
      return time.toLocaleDateString('en-US', {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    },

    hoursMinutesString: (timeZone: TimeZone = 'America/New_York'): string => {
      return time.toLocaleString('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    },

    minutesPastMidnight: (timeZone: TimeZone = 'America/New_York'): number => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      };

      const timeString = time.toLocaleString('en-US', options);

      // Extract hours and minutes from the formatted string
      const [hours, minutes] = timeString.split(':').map(Number);

      // Calculate the total minutes from the start of the day
      return hours * 60 + minutes;
    },

    seconds: (timeZone: TimeZone = 'America/New_York'): number => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      // Get the current time in the specified timeZone as a formatted string
      const timeString = time.toLocaleString('en-US', options);

      // Extract hours, minutes, and seconds from the formatted string
      const [hours, minutes, seconds] = timeString.split(':').map(Number);

      // Calculate the total minutes from the start of the day
      return hours * 60 + minutes + seconds;
    },

    milliseconds: (timeZone: TimeZone = 'America/New_York'): number => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      // Get the current time in the specified timeZone as a formatted string
      const timeString = time.toLocaleString('en-US', options);

      // Extract hours, minutes, and seconds from the formatted string
      const [hours, minutes, seconds] = timeString.split(':').map(Number);

      // Calculate the total seconds from start of day and convert to milliseconds
      return (hours * 60 + minutes + seconds) * 1000;
    },

    set: async (theTime: Date = new Date(Date.now())): Promise<void> => {
      time = theTime;
    },
  };
};

// Set up Client States
export const timeState = createTime(new Date(Date.now()));
export const uiState = createUi();
