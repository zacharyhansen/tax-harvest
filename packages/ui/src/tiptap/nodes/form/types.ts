import type { ComboboxOption } from "@repo/ui/components/combobox";

import type { LucideIcon } from "lucide-react";
import {
  Binary,
  CalendarCheck,
  CalendarRange,
  CaseSensitive,
  ChevronsLeftRightEllipsis,
  Grid2X2,
  KeyRound,
  PencilRuler,
  Phone,
  ScanText,
  Square,
  SquareMousePointer,
  ToggleLeft,
} from "lucide-react";

export enum FormNode {
  Text = "Text",
  Combobox = "Combobox",
  Checkbox = "Checkbox",
  Number = "Number",
  ComboboxMulti = "ComboboxMulti",
  Switch = "Switch",
  Password = "Password",
  Textarea = "Textarea",
  DatePicker = "DatePicker",
  DateRangePicker = "DateRangePicker",
  Phone = "Phone",
  Tiptap = "Tiptap",
  Slider = "Slider",
}

export type BaseFormNodeAttributes = {
  name: string;
  label: string;
  description: string;
  required: boolean;
  nameLocked: boolean;
};

export type TextNodeAttributes = {
  defaultValue: string;
  placeholder: string;
} & BaseFormNodeAttributes;

export type NumberNodeAttributes = {
  defaultValue: number;
  placeholder: string;
} & BaseFormNodeAttributes;

export type BooleanNodeAttributes = {
  defaultValue: boolean;
} & BaseFormNodeAttributes;

export type ComboboxNodeAttributes = {
  options: ComboboxOption[];
  placeholder: string;
  defaultValue: string;
} & BaseFormNodeAttributes;

export const formCommandIcon: Record<FormNode, LucideIcon> = {
  [FormNode.Text]: CaseSensitive,
  [FormNode.Number]: Binary,
  [FormNode.Checkbox]: SquareMousePointer,
  [FormNode.ComboboxMulti]: Grid2X2,
  [FormNode.Combobox]: Square,
  [FormNode.DatePicker]: CalendarCheck,
  [FormNode.DateRangePicker]: CalendarRange,
  [FormNode.Password]: KeyRound,
  [FormNode.Phone]: Phone,
  [FormNode.Slider]: ChevronsLeftRightEllipsis,
  [FormNode.Switch]: ToggleLeft,
  [FormNode.Textarea]: ScanText,
  [FormNode.Tiptap]: PencilRuler,
};

export const formCommandLabel: Record<FormNode, string> = {
  [FormNode.Text]: "Text",
  [FormNode.Number]: "Number",
  [FormNode.Checkbox]: "Checkbox",
  [FormNode.ComboboxMulti]: "Multi Select",
  [FormNode.Combobox]: "Select",
  [FormNode.DatePicker]: "Date",
  [FormNode.DateRangePicker]: "Date Range",
  [FormNode.Password]: "Password",
  [FormNode.Phone]: "Phone",
  [FormNode.Slider]: "Slider",
  [FormNode.Switch]: "Switch",
  [FormNode.Textarea]: "Textarea",
  [FormNode.Tiptap]: "Rich Text",
};
