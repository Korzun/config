import { NotDefinedConfigError, ListValueConfigError } from './error';

export type GetNumberOptions = {
  allowList?: number[];
  allowUndefined?: boolean;
  default?: number;
};
/**
 * Returns an environmental variable as a `number`
 */
export function getNumber(
  name: string,
  options: {
    allowList?: number[];
    allowUndefined: true;
    default?: undefined;
  },
): number | undefined;
export function getNumber(
  name: string,
  options?: {
    allowList?: number[];
    allowUndefined?: false;
    default?: undefined;
  },
): number;
export function getNumber(
  name: string,
  options: {
    allowList?: number[];
    allowUndefined?: false;
    default: number;
  },
): number;
export function getNumber(name: string, options: GetNumberOptions = {}) {
  const { allowList, allowUndefined, default: defaultValue } = options;
  const stringValue = process.env[name];
  if (stringValue !== undefined && stringValue !== '') {
    const value = Number(stringValue);
    if (allowList !== undefined && !allowList.includes(value)) {
      const error = new ListValueConfigError(name, stringValue, allowList);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(error, getNumber);
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
    Error.captureStackTrace(error, getNumber);
  }
  throw error;
}
