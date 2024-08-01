import type { HueActionType } from '@types';

export const isHueActionType = (value: string): value is HueActionType => {
  return value === 'lights' || value === 'groups';
};
