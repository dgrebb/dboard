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

// Example usage:
// const rgb: RGB = { r: 255, g: 200, b: 100 };
// const result: XYBri = rgbToXyBri(rgb);
// console.log(result); // {x: 0.5139, y: 0.4147, bri: 213}
