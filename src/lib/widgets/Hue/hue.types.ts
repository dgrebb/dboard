export type HueActionType = 'lights' | 'groups';

export const isHueActionType = (value: string): value is HueActionType => {
  return value === 'lights' || value === 'groups';
};
