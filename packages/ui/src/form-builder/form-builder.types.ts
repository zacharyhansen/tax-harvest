import type { ReactNode } from "react";

enum Field {
  select = "select",
  selectmulti = "selectmulti",
  phone = "phone",
  password = "password",
  checkbox = "checkbox",
  date = "date",
  datetime = "datetime",
  signature = "signature",
  slider = "slider",
  switch = "switch",
  textarea = "textarea",
}

export type FormBuilderSpec = {
  form: string;
};

type FieldSpec = {
  description?: string;
  disabled?: boolean;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  rowIndex: number;
  type: Field;
  value: string | Date | number | string[] | boolean;
};

export type FormSpec = {
  fields: FieldSpec;
};

export type BaseFieldProps = {
  name: string;
  description?: ReactNode;
  label: ReactNode;
};
