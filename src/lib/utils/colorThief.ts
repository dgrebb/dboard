import { FastAverageColor } from 'fast-average-color';

export const colorThief = async (imageSrc: string): Promise<string> => {
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
          colors.push(color.rgba);
        }

        // Create a gradient string using the captured colors
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
// const imageSrc = 'https://example.com/path-to-your-image.jpg';
// createGradientFromImage(imageSrc)
//     .then(gradient => console.log(gradient))
//     .catch(error => console.error(error));
