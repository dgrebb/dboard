import type { LocationType } from '@root/lib/types';

export const isLocationSettings = (
  location: unknown
): location is LocationType => {
  const loc = location as LocationType;
  return (
    typeof loc.primary === 'boolean' &&
    typeof loc.name === 'string' &&
    typeof loc.timeZone === 'string' &&
    typeof loc.latitude === 'number' &&
    typeof loc.longitude === 'number'
  );
};
