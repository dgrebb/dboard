import { FastAverageColor } from 'fast-average-color';
import { createCanvas, loadImage } from 'canvas';
import { PUBLIC_HOST_URL } from '$env/static/public';

// Simple seeded random number generator
const seedRandom = () => {
  let s = Date.now();
  return () => {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
};

// Function to adjust color components randomly
const randomizeColorComponent = (component, random) => {
  const variation = 20; // Maximum variation for the color component
  return Math.min(
    255,
    Math.max(0, component + Math.floor((random() - 0.5) * variation * 2))
  );
};

// Function to randomize colors
const randomizeColor = (color, random) => {
  return `rgb(${randomizeColorComponent(color[0], random)}, ${randomizeColorComponent(color[1], random)}, ${randomizeColorComponent(color[2], random)})`;
};

export const colorThief = async (
  imageSrc: string
): Promise<string | boolean> => {
  const imageUrl = imageSrc.includes('http')
    ? imageSrc
    : `${PUBLIC_HOST_URL}${imageSrc}`;

  const fac = new FastAverageColor();

  try {
    const img = await loadImage(imageUrl);
    const colors: string[] = [];
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
      const randomizedColor = randomizeColor(color, random);
      colors.push(randomizedColor);
    }

    // Create a gradient string using the captured and randomized colors
    const gradient = `linear-gradient(45deg, ${colors.join(', ')})`;
    return gradient;
  } catch (error) {
    console.error(error);
    console.log([
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
//     .then(gradient => console.log(gradient))
//     .catch(error => console.error(error));
