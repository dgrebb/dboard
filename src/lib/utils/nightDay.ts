export const nightDay = async function nightDay(isDay = 0) {
  if (isDay !== undefined) {
    switch (isDay) {
      case 1:
        document.documentElement.classList.toggle('light', true);
        document.documentElement.classList.toggle('dark', false);
        localStorage.setItem('color-theme', 'light');
        break;

      case 0:
        document.documentElement.classList.toggle('light', false);
        document.documentElement.classList.toggle('dark', true);
        localStorage.setItem('color-theme', 'dark');
        break;

      default:
        document.documentElement.classList.toggle('light', false);
        document.documentElement.classList.toggle('dark', true);
        localStorage.setItem('color-theme', 'dark');
        break;
    }
  }
};
