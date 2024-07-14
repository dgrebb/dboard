import { FastAverageColor } from 'fast-average-color';
import { createCanvas, loadImage } from 'canvas';
import { PUBLIC_HOST_URL } from '$env/static/public';
import type { GradientResult } from '../types';

// Simple seeded random number generator
const seedRandom = () => {
  let s = Date.now();
  return () => {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
};

const getRandomAngle = () => Math.floor(Math.random() * 361);

// Function to adjust color components randomly
const randomizeColorComponent = (
  component: number,
  random: () => number
): number => {
  const variation = 20; // Maximum variation for the color component
  const newComponent = component + Math.floor((random() - 0.5) * variation * 2);
  return Math.min(255, Math.max(0, newComponent));
};

// Function to randomize colors
const randomizeColor = (color: number[], random: () => number): string => {
  return `rgb(${randomizeColorComponent(color[0], random)}, ${randomizeColorComponent(color[1], random)}, ${randomizeColorComponent(color[2], random)})`;
};

// Function to create contrasting color by inverting the RGB values
const invertColor = (color: number[]): number[] => {
  return [255 - color[0], 255 - color[1], 255 - color[2]];
};

interface ColorThiefResult {
  backgroundGradient: string;
  foregroundGradient: string;
}

export const createGradient = async (
  image: string
): Promise<GradientResult | boolean> => {
  if (typeof image !== 'string') return false;

  try {
    const gradientResult = await colorThief(image);
    let backgroundGradient: string | undefined;
    let foregroundGradient: string | undefined;

    if (gradientResult && typeof gradientResult !== 'boolean') {
      ({ backgroundGradient, foregroundGradient } = gradientResult);
    }

    return {
      backgroundGradient: backgroundGradient || '',
      foregroundGradient: foregroundGradient || '',
    };
  } catch (error) {
    console.error('Error creating gradient:', error);
    return false;
  }
};

export const colorThief = async (
  imageSrc: string
): Promise<ColorThiefResult | boolean> => {
  const imageUrl = imageSrc.includes('http')
    ? imageSrc
    : `${PUBLIC_HOST_URL}${imageSrc}`;

  const fac = new FastAverageColor();

  try {
    const img = await loadImage(imageUrl);
    const backgroundColors: string[] = [];
    const foregroundColors: string[] = [];
    const sections = 5; // Number of sections to divide the image into

    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to create canvas context');
    }

    const width = img.width / sections;
    const height = img.height / sections;

    // Use the current time as the seed for the random number generator
    const random = seedRandom();

    for (let i = 0; i < sections; i++) {
      // Draw a section of the image on the canvas
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(
        img,
        i * width,
        0,
        width,
        img.height,
        0,
        0,
        width,
        img.height
      );

      // Get the dominant color of the section
      const imageData = ctx.getImageData(0, 0, width, img.height);
      const color = fac.getColorFromArray4(imageData.data);

      // Ensure the color is valid
      if (color && color.length >= 3) {
        const randomizedColor = randomizeColor(color, random);
        backgroundColors.push(randomizedColor);

        // Create contrasting color
        const invertedColor = invertColor(color);

        const randomizedInvertedColor = randomizeColor(invertedColor, random);

        foregroundColors.push(randomizedInvertedColor);
      } else {
        console.error('Invalid color data:', color); // Debug log
      }
    }

    // Create gradient strings using the captured and randomized colors
    const backgroundGradient = `linear-gradient(${getRandomAngle()}deg, ${backgroundColors.join(', ')})`;
    const foregroundGradient = `linear-gradient(${getRandomAngle()}deg, ${foregroundColors.join(', ')})`;
    return { backgroundGradient, foregroundGradient };
  } catch (error) {
    console.error(error);
    console.info([
      `Image source is missing. Gradient cannot be processed.`,
      `Original Source: ${imageSrc}`,
      `Processed Upstream Request: ${imageUrl}`,
    ]);
    return false;
  } finally {
    fac.destroy();
  }
};

// Usage example:
// const imageSrc = 'https://example.com/path-to-your-image.jpg?ts=1719132849317';
// colorThief(imageSrc)
//     .then(gradients => console.info(gradients))
//     .catch(error => console.error(error));
