# Config

[![npm version](https://badge.fury.io/js/@korzun%2Fconfig.svg)](https://badge.fury.io/js/@korzun%2Fconfig)

Easy Application Configuration Using Environment Variables

## Installation

```shell
npm i @korzun/config
```

or

```shell
yarn add @korzun/config
```

## Example

```ts
// config.ts
import { getBoolean, getNumber, getString } from '@korzun/config';

export const log = {
  enableColors: getBoolean('LOG_ENABLE_COLORS', {
    default: true
  }),
  flushFrequency: getNumber('LOG_FLUSH_DURATION', {
    allowRange: [500, 10_000],
    default: 1000
  }), 
  level: getString('LOG_LEVEL', {
    allowList: ['debug', 'info', 'warn', 'error', 'disabled'],
    default: 'error'
  }),
  transport: getString('LOG_TRANSPORT', {
    allowList: ['file', 'http', 'log'],
    allowUndefined: true,
  }),
};
```
