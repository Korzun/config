import { NotDefinedConfigError } from './error';

type GetBooleanOptionsAllowUndefined = {
  allowUndefined: true;
  default?: undefined;
};
type GetBooleanOptionsNoDefault = {
  allowUndefined?: false;
  default?: undefined;
};
type GetBooleanOptionsDefault = {
  allowUndefined?: false;
  default: boolean;
};

export type GetBooleanOptions =
  | GetBooleanOptionsAllowUndefined
  | GetBooleanOptionsNoDefault
  | GetBooleanOptionsDefault;

/**
 * Returns an environmental variable as a `boolean` or undefined.
 */
export function getBoolean(
  name: string,
  options: {
    allowUndefined: true;
    default?: undefined;
  },
): boolean | undefined;
/**
 * Returns an environmental variable as a `boolean` or, if undefined, throws an error.
 */
export function getBoolean(
  name: string,
  options?: {
    allowUndefined?: false;
    default?: undefined;
  },
): boolean;
/**
 * Returns an environmental variable as a `boolean` or, if undefined, the
 * provided default value.
 */
export function getBoolean(
  name: string,
  options: {
    allowUndefined?: false;
    default: boolean;
  },
): boolean;
export function getBoolean(name: string, options: GetBooleanOptions = {}) {
  const { allowUndefined, default: defaultValue } = options;
  const value = process.env[name];
  if (value !== undefined && value !== '') {
    return value === 'true';
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  if (allowUndefined) {
    return undefined;
  }
  const error = new NotDefinedConfigError(name);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, getBoolean);
  }
  throw error;
}
