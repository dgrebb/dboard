export default function fahrenheitToColorShade(temperatureF: number): string {
  // Convert Fahrenheit to Celsius for easier range handling
  const temperatureC = ((temperatureF - 32) * 5) / 9;

  // Define temperature ranges (in Celsius)
  const coldTemp = 0; // Freezing point of water
  const mildTemp = 15; // Mild temperature
  const hotTemp = 30; // Hot day

  // Define RGB colors
  const coldColor = { r: 0, g: 137, b: 255 }; // Blue for cold
  const mildColor = { r: 0, g: 255, b: 0 }; // Green for mild
  const hotColor = { r: 255, g: 0, b: 0 }; // Red for hot

  // Calculate the ratio of the current temperature between the color ranges
  let ratio: number;
  let r: number, g: number, b: number;

  if (temperatureC <= coldTemp) {
    return `rgba(${coldColor.r}, ${coldColor.g}, ${coldColor.b}, 0.7)`;
  } else if (temperatureC >= hotTemp) {
    return `rgba(${hotColor.r}, ${hotColor.g}, ${hotColor.b}, 0.7)`;
  } else if (temperatureC < mildTemp) {
    // Calculate the ratio between cold and mild
    ratio = (temperatureC - coldTemp) / (mildTemp - coldTemp);
    r = coldColor.r + ratio * (mildColor.r - coldColor.r);
    g = coldColor.g + ratio * (mildColor.g - coldColor.g);
    b = coldColor.b + ratio * (mildColor.b - coldColor.b);
  } else {
    // Calculate the ratio between mild and hot
    ratio = (temperatureC - mildTemp) / (hotTemp - mildTemp);
    r = mildColor.r + ratio * (hotColor.r - mildColor.r);
    g = mildColor.g + ratio * (hotColor.g - mildColor.g);
    b = mildColor.b + ratio * (hotColor.b - mildColor.b);
  }

  // Return the RGBA color with 0.7 opacity
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0.7)`;
}
