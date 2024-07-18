/**
 * Type representing a NightScout reading.
 */
export type NightScoutReading = {
  _id: string;
  sgv: number;
  trend: number;
  direction: string;
};

/**
 * Type representing an array of NightScout readings.
 */
export type NightScoutData = NightScoutReading[];

/**
 * Type representing a NightScout widget.
 */
export type NightScoutWidget = {
  type: 'NightScout';
  data: NightScoutData;
};

/**
 * Type representing a glucose data point in a chart series.
 */
export type ChartSeriesGlucose = {
  sgv: number;
};
