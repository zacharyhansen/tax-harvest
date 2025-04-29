import { z } from 'zod';

export const cleanNumber = (val: unknown) =>
  typeof val === 'string' ? parseFloat(val.replace(/[^\d.-]/g, '')) : val;

export const zodNumber = z.preprocess(
  val =>
    typeof val === 'string' ? parseFloat(val.replace(/[^\d.-]/g, '')) : val,
  z.number()
);
