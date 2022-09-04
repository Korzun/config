import { NotDefinedConfigError } from './error';

export type GetBooleanOptions = {
  allowUndefined?: boolean;
  default?: boolean;
};
/**
 * Returns an environmental variable as a `boolean`
 */
export function getBoolean(
  name: string,
  options: {
    allowUndefined: true;
    default?: undefined;
  },
): boolean | undefined;
export function getBoolean(
  name: string,
  options?: {
    allowUndefined?: false;
    default?: undefined;
  },
): boolean;
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
