/**
 * Every input must implement this interface (these fields are used in form specifications)
 */
export interface BaseInputProps {
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Every input must implement this interface (these fields are used in form specifications)
 */
export type BaseInputPropsType = BaseInputProps;

export type BaseInputPropsUnion = 'placeholder' | 'disabled';
