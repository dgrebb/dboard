import type { SeptaNextToArriveData } from '$types';

const SeptaNextToArriveDataKeys: (keyof SeptaNextToArriveData)[] = [
  'orig_train',
  'orig_line',
  'orig_departure_time',
  'orig_arrival_time',
  'orig_delay',
  'isdirect',
];

export function isSeptaNextToArriveDataArray(
  arr: unknown[]
): arr is SeptaNextToArriveData[] {
  return (
    Array.isArray(arr) &&
    arr.every(
      (obj) =>
        typeof obj === 'object' &&
        obj !== null &&
        SeptaNextToArriveDataKeys.every(
          (key) => typeof obj[key as keyof typeof obj] === 'string'
        )
    )
  );
}
