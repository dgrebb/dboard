export const convertCentiDegreesToFahrenheit = (
  centiDegrees: number
): number => {
  // Convert centi-degrees Celsius to degrees Celsius
  const celsius = centiDegrees / 100;

  // Convert degrees Celsius to Fahrenheit
  const fahrenheit = (celsius * 9) / 5 + 32;

  // Round to the nearest tenth
  return Math.round(fahrenheit * 10) / 10;
};
