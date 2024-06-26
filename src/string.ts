import { NotDefinedConfigError, ListValueConfigError } from './error';

type GetStringOptionsAllow = {
  allowList?: string[];
};

type GetStringOptionsAllowUndefined = {
  allowUndefined: true;
  default?: undefined;
} & GetStringOptionsAllow;
type GetStringOptionsNoDefault = {
  allowUndefined?: false;
  default?: undefined;
} & GetStringOptionsAllow;
type GetStringOptionsDefault = {
  allowUndefined?: false;
  default: string;
} & GetStringOptionsAllow;

export type GetStringOptions =
  | GetStringOptionsAllowUndefined
  | GetStringOptionsNoDefault
  | GetStringOptionsDefault;

/**
 * Returns an environmental variable as a `string` or undefined. Optionally the
 * value can be validated by an `allowList`.
 */
export function getString(
  name: string,
  options: {
    allowList?: string[];
    allowUndefined: true;
    default?: undefined;
  },
): string | undefined;
/**
 * Returns an environmental variable as a `string` or, if undefined, throws an
 * error. Optionally the value can be validated by an `allowList`.
 */
export function getString(
  name: string,
  options?: {
    allowList?: string[];
    allowUndefined?: false;
    default?: undefined;
  },
): string;
/**
 * Returns an environmental variable as a `string` or, if undefined, the
 * provided default value. Optionally the value can be validated by an `allowList`.
 */
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
    validateList(name, value, allowList);
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

type GetStringArrayOptionsAllow = {
  allowList?: string[];
};

type GetStringArrayOptionsAllowUndefined = {
  allowUndefined: true;
  default?: undefined;
} & GetStringArrayOptionsAllow;
type GetStringArrayOptionsNoDefault = {
  allowUndefined?: false;
  default?: undefined;
} & GetStringArrayOptionsAllow;
type GetStringArrayOptionsDefault = {
  allowUndefined?: false;
  default: string[];
} & GetStringArrayOptionsAllow;

export type GetStringArrayOptions =
  | GetStringArrayOptionsAllowUndefined
  | GetStringArrayOptionsNoDefault
  | GetStringArrayOptionsDefault;

/**
 * Returns an environmental variable as a `string` array. Optionally the value
 * can be validated by an `allowList`.
 */
export function getStringArray(
  name: string,
  options: {
    allowList?: string[];
    allowUndefined: true;
    default?: undefined;
  },
): string[];
/**
 * Returns an environmental variable as a `string` array or, if undefined,
 * throws an error. Optionally the values can be validated by an `allowList`.
 */
export function getStringArray(
  name: string,
  options?: {
    allowList?: string[];
    allowUndefined?: false;
    default?: undefined;
  },
): string[];
/**
 * Returns an environmental variable as a `string` array or, if undefined, the
 * provided default value. Optionally the values can be validated by an `allowList`.
 */
export function getStringArray(
  name: string,
  options: {
    allowList?: string[];
    allowUndefined?: false;
    default: string[];
  },
): string[];
export function getStringArray(
  name: string,
  options: GetStringArrayOptions = {},
) {
  const { allowList, allowUndefined, default: defaultValue } = options;
  const value = process.env[name];
  if (value !== undefined && value !== '') {
    const valueList = value.split(',');
    valueList.forEach((value) => validateList(name, value, allowList));
    return valueList;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  if (allowUndefined) {
    return [];
  }
  const error = new NotDefinedConfigError(name);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, getString);
  }
  throw error;
}

const validateList = (name: string, value: string, list?: string[]): void => {
  if (list !== undefined && !list.includes(value)) {
    const error = new ListValueConfigError(name, value, list);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, getString);
    }
    throw error;
  }
};
