import { WEATHER_API } from '../../.config/GLOBALS';
import type { FetchOptions, SolarData } from '../types';

// Function to calculate the background color gradient based on current time, sunrise, and sunset
function calculateBackgroundColorGradient(
  currentTime: number,
  sunrise: number,
  sunset: number
): string {
  const dawnStart: number = sunrise - 3600000; // Dawn starts 1 hour before sunrise
  const dawnEnd: number = sunrise; // Dawn ends at sunrise
  const duskStart: number = sunset; // Dusk starts at sunset
  const duskEnd: number = sunset + 3600000; // Dusk ends 1 hour after sunset

  // Define colors for different times of the day
  const dawnColor: number[] = [255, 183, 94]; // Light orange
  const dayColor: number[] = [135, 206, 250]; // Light sky blue
  const duskColor: number[] = [253, 94, 83]; // Light red
  const nightColor: number[] = [11, 11, 51]; // Dark blue

  let color: number[];
  let sky: string;

  // Interpolate between different colors based on current time
  if (currentTime >= dawnStart && currentTime < dawnEnd) {
    const progress: number = (currentTime - dawnStart) / (dawnEnd - dawnStart);
    color = interpolateColor(nightColor, dawnColor, progress);
  } else if (currentTime >= dawnEnd && currentTime < sunrise) {
    const progress: number = (currentTime - dawnEnd) / (sunrise - dawnEnd);
    color = interpolateColor(dawnColor, dayColor, progress);
  } else if (currentTime >= sunrise && currentTime < sunset) {
    const progress: number = (currentTime - sunrise) / (sunset - sunrise);
    color = interpolateColor(dayColor, duskColor, progress);
  } else if (currentTime >= sunset && currentTime < duskEnd) {
    const progress: number = (currentTime - sunset) / (duskEnd - sunset);
    color = interpolateColor(duskColor, nightColor, progress);
  } else {
    color = nightColor; // Default to night color
  }

  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

async function calculateBaseBackgroundColorGradient(
  currentTime: number, // Time in milliseconds since midnight
  sunrise: number, // Time of sunrise in milliseconds since midnight
  sunset: number // Time of sunset in milliseconds since midnight
): Promise<string> {
  // Convert time values to percentages (0 to 1) relative to the day length
  const timePercentage: number = (currentTime - sunrise) / (sunset - sunrise);
  // Define sky colors for different times of the day
  const dawnColor: number[] = [255, 183, 94]; // Color at dawn (orange)
  const dayColor: number[] = [135, 206, 235]; // Color during the day (light blue)
  const duskColor: number[] = [255, 193, 193]; // Color at dusk (pink)
  const nightColor: number[] = [17, 18, 14]; // Color at dusk (pink)

  let color: number[];

  if (timePercentage < 0.25) {
    // Dawn to morning transition
    color = interpolateBaseColor(dawnColor, dayColor, timePercentage / 0.25);
  } else if (timePercentage < 0.5) {
    // Morning to evening transition
    color = interpolateBaseColor(
      dayColor,
      dayColor,
      (timePercentage - 0.25) / 0.5
    );
  } else if (timePercentage < 0.75) {
    // Morning to evening transition
    color = interpolateBaseColor(
      dayColor,
      duskColor,
      (timePercentage - 0.5) / 0.5
    );
  } else {
    // Evening to night transition
    color = interpolateBaseColor(
      duskColor,
      nightColor,
      (timePercentage - 0.75) / 0.5
    );
  }

  // Convert the RGB color to hexadecimal
  return rgbToHex(color[0], color[1], color[2]);
}

// Function to interpolate between two colors
function interpolateBaseColor(
  color1: number[],
  color2: number[],
  ratio: number
): number[] {
  return color1.map((channel, index) =>
    Math.round(channel + ratio * (color2[index] - channel))
  );
}

// Function to convert RGB color to hexadecimal
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Function to interpolate between two colors based on progress
function interpolateColor(
  color1: number[],
  color2: number[],
  progress: number
): number[] {
  const r: number = Math.round(color1[0] + (color2[0] - color1[0]) * progress);
  const g: number = Math.round(color1[1] + (color2[1] - color1[1]) * progress);
  const b: number = Math.round(color1[2] + (color2[2] - color1[2]) * progress);
  return [r, g, b];
}

// Function to update background color gradient based on sunrise and sunset data
export default async function updateBackgroundColorGradient(
  sunrise: string,
  sunset: string
): Promise<void> {
  const body = document.body;
  const rise = new Date(sunrise).getTime();
  const set = new Date(sunset).getTime();
  const currentTime: number = new Date().getTime();
  const gradientColor: string = calculateBackgroundColorGradient(
    currentTime,
    rise,
    set
  );
  let bgColor: string = body.style.getPropertyValue('--bgColor');

  bgColor = await calculateBaseBackgroundColorGradient(currentTime, rise, set);
  body.style.setProperty('--skyBaseColor', gradientColor);
  body.style.setProperty('--bgColor', bgColor);
  body.classList.toggle('ready', true);
}

// Example usage: update background color gradient based on sunrise and sunset data for a given latitude and longitude
// const latitude: number = YOUR_LATITUDE; // Replace YOUR_LATITUDE with the desired latitude
// const longitude: number = YOUR_LONGITUDE; // Replace YOUR_LONGITUDE with the desired longitude
// updateBackgroundColorGradient(latitude, longitude);
