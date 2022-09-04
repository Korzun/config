import { getBoolean } from './boolean';
import { NotDefinedConfigError } from './error';

describe('getBoolean', () => {
  let env: Record<string, string | undefined>;
  beforeEach(() => {
    env = Object.assign({}, process.env);
  });
  Object.assign({}, process.env);
  afterEach(() => {
    process.env = env;
  });

  describe('environment variable is set', () => {
    it('returns the environment variable as an number', () => {
      process.env.TEST_BOOLEAN = 'true';
      const value = getBoolean('TEST_BOOLEAN');
      expect(value).toBeTruthy();
    });
    describe('allow undefined', () => {
      it('returns the environment variable as an number', () => {
        process.env.TEST_BOOLEAN = 'true';
        const value = getBoolean('TEST_BOOLEAN', { allowUndefined: true });
        expect(value).toBeTruthy();
      });
    });
    describe('default is set', () => {
      it('returns the environment variable as an number', () => {
        process.env.TEST_BOOLEAN = 'true';
        const value = getBoolean('TEST_BOOLEAN', { default: false });
        expect(value).toBeTruthy();
      });
    });
  });
  describe('environment variable is set to an empty string', () => {
    it('throws an error', () => {
      process.env.TEST_BOOLEAN = '';
      expect(() => {
        getBoolean('TEST_BOOLEAN');
      }).toThrow(new NotDefinedConfigError('TEST_BOOLEAN'));
    });

    describe('allow undefined', () => {
      it('returns undefined', () => {
        process.env.TEST_BOOLEAN = '';
        const value = getBoolean('TEST_BOOLEAN', { allowUndefined: true });
        expect(value).toBeUndefined();
      });
    });

    describe('default is set', () => {
      it('returns the default', () => {
        process.env.TEST_BOOLEAN = '';
        const value = getBoolean('TEST_BOOLEAN', { default: false });
        expect(value).toBeFalsy();
      });
    });
  });
  describe('environment variable is not set', () => {
    it('throws an error', () => {
      expect(() => {
        getBoolean('TEST_BOOLEAN');
      }).toThrow(new NotDefinedConfigError('TEST_BOOLEAN'));
    });

    describe('allow undefined', () => {
      it('returns undefined', () => {
        const value = getBoolean('TEST_BOOLEAN', { allowUndefined: true });
        expect(value).toBeUndefined();
      });
    });

    describe('default is set', () => {
      it('returns the default', () => {
        const value = getBoolean('TEST_BOOLEAN', { default: false });
        expect(value).toBeFalsy();
      });
    });
  });
});
