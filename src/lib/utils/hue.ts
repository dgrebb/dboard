import type { RGB, XYBri } from '$lib/types';

export const enhanceColor = (normalized: number) => {
  if (normalized > 0.04045) {
    return Math.pow((normalized + 0.055) / (1.0 + 0.055), 2.4);
  } else {
    return normalized / 12.92;
  }
};

export const RGBtoXY = (r: number, g: number, b: number) => {
  const rNorm = r / 255.0;
  const gNorm = g / 255.0;
  const bNorm = b / 255.0;

  const rFinal = enhanceColor(rNorm);
  const gFinal = enhanceColor(gNorm);
  const bFinal = enhanceColor(bNorm);

  const X = rFinal * 0.649926 + gFinal * 0.103455 + bFinal * 0.197109;
  const Y = rFinal * 0.234327 + gFinal * 0.743075 + bFinal * 0.022598;
  const Z = rFinal * 0.0 + gFinal * 0.053077 + bFinal * 1.035763;

  if (X + Y + Z === 0) {
    return [0, 0];
  } else {
    const xFinal = X / (X + Y + Z);
    const yFinal = Y / (X + Y + Z);

    return [xFinal, yFinal];
  }
};

export const rgbToXyBri = (rgb: RGB, alpha: number): XYBri => {
  function enhanceColor(normalized: number): number {
    return normalized > 0.04045
      ? Math.pow((normalized + 0.055) / (1.0 + 0.055), 2.4)
      : normalized / 12.92;
  }

  const rNorm = rgb.r / 255.0;
  const gNorm = rgb.g / 255.0;
  const bNorm = rgb.b / 255.0;
  const bri = Math.round(alpha * 255);

  const rFinal = enhanceColor(rNorm);
  const gFinal = enhanceColor(gNorm);
  const bFinal = enhanceColor(bNorm);

  const X = rFinal * 0.649926 + gFinal * 0.103455 + bFinal * 0.197109;
  const Y = rFinal * 0.234327 + gFinal * 0.743075 + bFinal * 0.022598;
  const Z = rFinal * 0.0 + gFinal * 0.053077 + bFinal * 1.035763;

  const x = X / (X + Y + Z);
  const y = Y / (X + Y + Z);

  return { x, y, bri };
};

export const rgbToXy = (r: number, g: number, b: number): [number, number] => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const X = red * 0.649926 + green * 0.103455 + blue * 0.197109;
  const Y = red * 0.234327 + green * 0.743075 + blue * 0.022598;
  const Z = red * 0.0 + green * 0.053077 + blue * 1.035763;

  const x = X / (X + Y + Z);
  const y = Y / (X + Y + Z);

  return [x, y];
};

export const getVibrantColors = (gradient: string): number[][] => {
  const colors = gradient.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/g
  );

  if (!colors) {
    return [
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
    ]; // Default to primary colors if no colors found
  }

  const colorArray = colors
    .map((color) => {
      const matched = color.match(/\d+/g);
      if (!matched) {
        return { r: 0, g: 0, b: 0 }; // Fallback in case of unexpected null
      }
      const [r, g, b] = matched.map(Number);
      return { r, g, b };
    })
    .filter(({ r, g, b }) => {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      return max - min > 50 && max > 50 && min < 200;
    })
    .map(({ r, g, b }) => {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const chroma = max - min;
      const saturation = max === 0 ? 0 : chroma / max;
      const value = max / 255;

      const vibrancy = saturation * value;

      return { r, g, b, vibrancy };
    });

  return colorArray
    .sort((a, b) => b.vibrancy - a.vibrancy)
    .slice(0, 3)
    .map(({ r, g, b }) => [r, g, b]);
};
