import type { ReactNode } from 'react';

enum Field {
  select = 'select',
  selectmulti = 'selectmulti',
  phone = 'phone',
  password = 'password',
  checkbox = 'checkbox',
  date = 'date',
  datetime = 'datetime',
  signature = 'signature',
  slider = 'slider',
  switch = 'switch',
  textarea = 'textarea',
}

interface FormBuilderSpec {
  form: string;
}

interface FieldSpec {
  description?: string;
  disabled?: boolean;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  rowIndex: number;
  type: Field;
  value: string | Date | number | string[] | boolean;
}

interface FormSpec {
  fields: FieldSpec;
}

export interface BaseFieldProps {
  name: string;
  description?: ReactNode;
  label: ReactNode;
}
