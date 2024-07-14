import type { ModalState, TimeZone, UIState } from '$types';

export const createUiState = () => {
  const ui: UIState = $state({
    modalState: {
      isActive: false,
      component: undefined,
    },
  });

  return {
    modal: (): ModalState => {
      return ui.modalState;
    },

    modalActive: (): ModalState['isActive'] => {
      return ui.modalState.isActive;
    },

    setModal: (state: ModalState) => {
      ui.modalState = state;
    },
  };
};

export const createTimeState = (initialTime: Date) => {
  let timeStore = $state(initialTime);

  return {
    dateTime: () => {
      return timeStore;
    },

    dateTimeString: (timeZone: TimeZone = 'America/New_York') => {
      return timeStore.toLocaleDateString('en-US', {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    },

    hoursMinutesString: (timeZone: TimeZone = 'America/New_York'): string => {
      return timeStore.toLocaleString('en-US', {
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

      const timeString = timeStore.toLocaleString('en-US', options);

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
      const timeString = timeStore.toLocaleString('en-US', options);

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
      const timeString = timeStore.toLocaleString('en-US', options);

      // Extract hours, minutes, and seconds from the formatted string
      const [hours, minutes, seconds] = timeString.split(':').map(Number);

      // Calculate the total seconds from start of day and convert to milliseconds
      return (hours * 60 + minutes + seconds) * 1000;
    },

    set: async (theTime: Date = new Date(Date.now())): Promise<void> => {
      timeStore = theTime;
    },
  };
};

// Set up Client States
export const timeState = createTimeState(new Date(Date.now()));
export const uiState = createUiState();
