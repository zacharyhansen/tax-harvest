// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unused-vars */
import { capitalCase } from 'change-case';

import type { Enums } from '../database/database.types';

export enum HarvestType {
  REDUCE_COST_BASIS = 'REDUCE_COST_BASIS',
  REDUCE_TAXES = 'REDUCE_TAXES',
  SELL = 'SELL',
  CAPTURE_GAINS_TAX_FREE = 'CAPTURE_GAINS_TAX_FREE',
}

export const enumToOptions = (
  enumType: Record<string, string>
): {
  label: string;
  value: string;
}[] => {
  return Object.values(enumType).map(type => ({
    label: capitalCase(type),
    value: type,
  }));
};

// Ensure all enums conform to the database types
const _enumTypeCheck: {
  HarvestType: Record<keyof typeof HarvestType, Enums<'HarvestType'>>;
} = {
  HarvestType,
};
