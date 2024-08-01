import { TypeOfWidget } from '@types';

export const isTypeOfWidget = (type: string): type is TypeOfWidget => {
  return Object.values(TypeOfWidget).includes(type as TypeOfWidget);
};
