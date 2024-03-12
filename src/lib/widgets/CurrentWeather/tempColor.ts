export default function fahrenheitToColorShade(tempF: number) {
  // Define the temperature range (in Fahrenheit) where blue corresponds to lower temperatures and red to higher temperatures
  const minTemp = -20;
  const maxTemp = 110;

  // Define the corresponding RGBA values for blue and red
  const blueRGBA = [0, 0, 255, 0.7]; // Blue at 50% opacity
  const redRGBA = [255, 0, 0, 0.7]; // Red at 50% opacity

  // Normalize the temperature to a value between 0 and 1 within the defined range
  const normalizedTemp = (tempF - minTemp) / (maxTemp - minTemp);

  // Interpolate between blue and red based on the normalized temperature
  const interpolatedRGBA = [
    Math.round(
      blueRGBA[0] * (1 - normalizedTemp) + redRGBA[0] * normalizedTemp
    ),
    Math.round(
      blueRGBA[1] * (1 - normalizedTemp) + redRGBA[1] * normalizedTemp
    ),
    Math.round(
      blueRGBA[2] * (1 - normalizedTemp) + redRGBA[2] * normalizedTemp
    ),
    blueRGBA[3], // Opacity remains constant at 50%
  ];

  return `rgba(${interpolatedRGBA.join(', ')})`;
}
