import type { ChartSeriesGlucose } from '../types';

export const extractBGValues = function extractBGValues(
  data: ChartSeriesGlucose[]
) {
  return data.map((item) => item.sgv);
};
