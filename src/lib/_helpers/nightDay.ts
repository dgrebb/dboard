export const nightDay = async function nightDay(isDay: number = 0) {
  if (isDay !== undefined) {
    switch (isDay) {
      case 1:
        document.documentElement.classList.toggle('light', true);
        document.documentElement.classList.toggle('dark', false);
        localStorage.setItem('color-theme', 'light');
        // console.log(isDay, 'day');
        break;

      case 0:
        document.documentElement.classList.toggle('light', false);
        document.documentElement.classList.toggle('dark', true);
        localStorage.setItem('color-theme', 'dark');
        // console.log(isDay, 'night');
        break;

      default:
        document.documentElement.classList.toggle('light', false);
        document.documentElement.classList.toggle('dark', true);
        localStorage.setItem('color-theme', 'dark');
        // console.log(isDay, 'night');
        break;
    }
  }
};
