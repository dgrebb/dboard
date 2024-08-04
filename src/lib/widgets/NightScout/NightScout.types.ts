/**
 * Type representing a NightScout reading.
 */
export interface NightScoutReading {
  _id: string;
  sgv: number;
  trend: number;
  direction: string;
}

/**
 * Type representing an array of NightScout readings.
 */
export type NightScoutData = NightScoutReading[];

/**
 * Type representing a NightScout widget.
 */
export interface NightScoutWidget {
  type: 'NightScout';
  data: NightScoutData;
}

/**
 * Type representing a glucose data point in a chart series.
 */
export interface ChartSeriesGlucose {
  sgv: number;
}
