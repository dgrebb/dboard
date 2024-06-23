import { FastAverageColor } from 'fast-average-color';

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
  if (imageSrc === undefined) {
    console.log(imageSrc, `can't find the image`);
    return false;
  }
  const fac = new FastAverageColor();
  const img = new Image();
  img.crossOrigin = 'Anonymous';

  return new Promise<string>((resolve, reject) => {
    img.onload = async () => {
      try {
        const colors: string[] = [];
        const sections = 5; // Number of sections to divide the image into

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to create canvas context'));
          return;
        }

        const width = img.width / sections;
        const height = img.height / sections;

        // Extract the timestamp from the imageSrc and use it as the seed for the random number generator
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
          const color = await fac.getColorAsync(canvas);
          const randomizedColor = randomizeColor(color.value, random);
          colors.push(randomizedColor);
        }

        // Create a gradient string using the captured and randomized colors
        const gradient = `linear-gradient(45deg, ${colors.join(', ')})`;
        resolve(gradient);
      } catch (error) {
        reject(error);
      } finally {
        fac.destroy();
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageSrc;
  });
};

// Usage example:
// const imageSrc = 'https://example.com/path-to-your-image.jpg?ts=1719132849317';
// colorThief(imageSrc)
//     .then(gradient => console.log(gradient))
//     .catch(error => console.error(error));
