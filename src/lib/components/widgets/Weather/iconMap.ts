import type { IconMap } from '$lib/types';

const lightYellowGray = '#fbf1de';
const brightGreen = '#37cc37';
const brightYellow = '#ccc737';
const paleGreen = '#37cc7f';
const paleYellow = '#e5e5e5';
const lightBlue = '#8882cf';
const darkBlue = '#55508f';
const darkBlueGray = '#7347a8';
const paleBlueGreenGray = '#85aba0';
const moonSprinkle = 'rgb(162, 207, 234)';
const daySprinkle = 'rgb(104, 70, 240)';

export const dayIconMap: IconMap = {
  0: {
    icon: 'fluent:weather-sunny-20-filled',
    color: brightYellow,
    name: 'Clear',
  },
  1: {
    icon: 'material-symbols-light:partly-cloudy-day',
    color: paleGreen,
    name: 'Mainly clear',
  },
  2: {
    icon: 'fluent:weather-partly-cloudy-day-20-filled',
    color: paleBlueGreenGray,
    name: 'Partly Cloudy',
  },
  3: {
    icon: 'fluent:weather-cloudy-20-filled',
    color: '#62788d',
    name: 'Overcast',
  },
  45: {
    icon: 'fluent:weather-fog-20-filled',
    color: paleBlueGreenGray,
    name: 'Fog',
  },
  48: {
    icon: 'fluent:weather-fog-20-filled',
    color: paleBlueGreenGray,
    name: 'Rime Fog',
  },
  51: {
    icon: 'fluent:weather-drizzle-20-filled',
    color: daySprinkle,
    name: 'Light Drizzle',
  },
  53: {
    icon: 'fluent:weather-drizzle-20-filled',
    color: daySprinkle,
    name: 'Moderate Drizzle',
  },
  55: {
    icon: 'fluent:weather-drizzle-20-filled',
    color: daySprinkle,
    name: 'Dense Drizzle',
  },
  61: {
    icon: 'fluent:weather-rain-20-filled',
    color: lightBlue,
    name: 'Light Rain',
  },
  63: {
    icon: 'fluent:weather-rain-20-filled',
    color: lightBlue,
    name: 'Rain',
  },
  65: {
    icon: 'fluent:weather-rain-20-filled',
    color: lightBlue,
    name: 'Heavy Rain',
  },
  96: {
    icon: 'fluent:weather-thunderstorm-20-filled',
    color: darkBlueGray,
    name: 'Thunderstorms',
  },
};

export const nightIconMap: IconMap = {
  0: {
    icon: 'fluent:weather-moon-20-filled',
    color: paleYellow,
    name: 'Clear',
  },
  1: {
    icon: 'fluent:weather-partly-cloudy-night-20-filled',
    color: lightYellowGray,
    name: 'Mainly clear',
  },
  2: {
    icon: 'fluent:weather-partly-cloudy-night-20-filled',
    color: paleBlueGreenGray,
    name: 'Partly Cloudy',
  },
  3: {
    icon: 'fluent:weather-cloudy-20-filled',
    color: paleBlueGreenGray,
    name: 'Overcast',
  },
  45: {
    icon: 'fluent:weather-fog-20-filled',
    color: paleBlueGreenGray,
    name: 'Fog',
  },
  48: {
    icon: 'fluent:weather-fog-20-filled',
    color: paleBlueGreenGray,
    name: 'Rime Fog',
  },
  51: {
    icon: 'fluent:weather-drizzle-20-filled',
    color: moonSprinkle,
    name: 'Light Drizzle',
  },
  53: {
    icon: 'fluent:weather-drizzle-20-filled',
    color: moonSprinkle,
    name: 'Moderate Drizzle',
  },
  55: {
    icon: 'fluent:weather-drizzle-20-filled',
    color: moonSprinkle,
    name: 'Dense Drizzle',
  },
  61: {
    icon: 'fluent:weather-rain-20-filled',
    color: darkBlue,
    name: 'Light Rain',
  },
  63: {
    icon: 'fluent:weather-rain-20-filled',
    color: darkBlue,
    name: 'Rain',
  },
  65: {
    icon: 'fluent:weather-rain-20-filled',
    color: darkBlue,
    name: 'Heavy Rain',
  },
  96: {
    icon: 'fluent:weather-thunderstorm-20-filled',
    color: darkBlue,
    name: 'Thunderstorms',
  },
};

function mapWeatherIcon(weatherCode: number, isDay: number) {
  return {
    icon:
      isDay === 1
        ? dayIconMap[weatherCode].icon
        : nightIconMap[weatherCode].icon,
    color:
      isDay === 1
        ? dayIconMap[weatherCode].color
        : nightIconMap[weatherCode].color,
    name:
      isDay === 1
        ? dayIconMap[weatherCode].name
        : nightIconMap[weatherCode].name,
  };
}

export default mapWeatherIcon;
