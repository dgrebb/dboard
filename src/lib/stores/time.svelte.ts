export const createTime = (initialTime: Date) => {
  const time = $state(initialTime);

  return {
    dateTimeString: () => {
      return time;
    },

    timeString: (timeZone: string): string => {
      return time.toLocaleString('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    },

    timezoneMilliseconds: (timeZone: string): number => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      // Get the current time in the specified timeZone as a formatted string
      const timeString = time.toLocaleString('en-US', options);

      // Extract hours and minutes from the formatted string
      const [hours, minutes] = timeString.split(':').map(Number);

      // Calculate the total minutes from the start of the day
      return (hours * 60 + minutes) * 1000;
    },

    timezoneSeconds: (timeZone: string): number => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      // Get the current time in the specified timeZone as a formatted string
      const timeString = time.toLocaleString('en-US', options);

      // Extract hours and minutes from the formatted string
      const [hours, minutes] = timeString.split(':').map(Number);

      // Calculate the total minutes from the start of the day
      return hours * 60 + minutes;
    },
  };
};

export const timeState = createTime(new Date(Date.now()));
