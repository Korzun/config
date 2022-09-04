import { NotDefinedConfigError, ValueConfigError } from './error';

export type GetStringOptions = {
  allowList?: string[];
  allowUndefined?: boolean;
  default?: string;
};
/**
 * Returns an environmental variable as a `string`
 */
export function getString(
  name: string,
  options: {
    allowList?: string[];
    allowUndefined: true;
    default?: string;
  },
): string | undefined;
export function getString(
  name: string,
  options?: {
    allowList?: string[];
    allowUndefined?: false;
    default?: undefined;
  },
): string;
export function getString(
  name: string,
  options: {
    allowList?: string[];
    allowUndefined?: false;
    default: string;
  },
): string;
export function getString(name: string, options: GetStringOptions = {}) {
  const { allowList, allowUndefined, default: defaultValue } = options;
  const value = process.env[name];
  if (value !== undefined && value !== '') {
    if (allowList !== undefined && !allowList.includes(value)) {
      const error = new ValueConfigError(name, value);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(error, getString);
      }
      throw error;
    }
    return value;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  if (allowUndefined) {
    return undefined;
  }
  const error = new NotDefinedConfigError(name);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, getString);
  }
  throw error;
}
