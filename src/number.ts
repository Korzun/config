import {
  ListValueConfigError,
  NotDefinedConfigError,
  RangeValueConfigError,
} from './error';

type GetNumberOptionsAllowList = {
  allowList?: number[];
  allowRange?: undefined;
};
type GetNumberOptionsAllowRange = {
  allowList?: undefined;
  allowRange?: [number, number];
};
type GetNumberOptionsAllow =
  | GetNumberOptionsAllowList
  | GetNumberOptionsAllowRange;

type GetNumberOptionsAllowUndefined = {
  allowUndefined: true;
  default?: undefined;
} & GetNumberOptionsAllow;
type GetNumberOptionsNoDefault = {
  allowUndefined?: false;
  default?: undefined;
} & GetNumberOptionsAllow;
type GetNumberOptionsDefault = {
  allowUndefined?: false;
  default: number;
} & GetNumberOptionsAllow;

export type GetNumberOptions =
  | GetNumberOptionsAllowUndefined
  | GetNumberOptionsNoDefault
  | GetNumberOptionsDefault;

/**
 * Returns an environmental variable as a `number` or undefined. Optionally the
 * value can be validated by an `allowList` or `allowRange`.
 */
export function getNumber(
  name: string,
  options: {
    allowUndefined: true;
    default?: undefined;
  } & (
    | {
        allowList?: undefined;
        allowRange?: undefined;
      }
    | {
        allowList: number[];
      }
    | {
        allowRange: [number, number];
      }
  ),
): number | undefined;
/**
 * Returns an environmental variable as a `number` or, if undefined, throws an
 * error. Optionally the value can be validated by an `allowList` or `allowRange`.
 */
export function getNumber(
  name: string,
  options?: {
    allowUndefined?: false;
    default?: undefined;
  } & (
    | {
        allowList?: undefined;
        allowRange?: undefined;
      }
    | {
        allowList: number[];
      }
    | {
        allowRange: [number, number];
      }
  ),
): number;
/**
 * Returns an environmental variable as a `number` or, if undefined, the
 * provided default value. Optionally the value can be validated by an
 * `allowList` or `allowRange`.
 */
export function getNumber(
  name: string,
  options: {
    allowUndefined?: false;
    default: number;
  } & (
    | {
        allowList?: undefined;
        allowRange?: undefined;
      }
    | {
        allowList: number[];
      }
    | {
        allowRange: [number, number];
      }
  ),
): number;
export function getNumber(name: string, options: GetNumberOptions = {}) {
  const {
    allowList,
    allowRange,
    allowUndefined,
    default: defaultValue,
  } = options;
  const stringValue = process.env[name];
  if (stringValue !== undefined && stringValue !== '') {
    const value = Number(stringValue);
    validateList(name, stringValue, value, allowList);
    validateRange(name, stringValue, value, allowRange);
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

const validateList = (
  name: string,
  stringValue: string,
  value: number,
  list?: number[],
): void => {
  if (list !== undefined && !list.includes(value)) {
    const error = new ListValueConfigError(name, stringValue, list);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, getNumber);
    }
    throw error;
  }
};

const validateRange = (
  name: string,
  stringValue: string,
  value: number,
  range?: [number, number],
): void => {
  if (range !== undefined && (value < range[0] || value > range[1])) {
    const error = new RangeValueConfigError(name, stringValue, range);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, getNumber);
    }
    throw error;
  }
};
