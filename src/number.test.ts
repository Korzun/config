import { NotDefinedConfigError, ListValueConfigError } from './error';
import { getNumber } from './number';

describe('getNumber', () => {
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
      process.env.TEST_NUMBER = '10.33';
      const value = getNumber('TEST_NUMBER');
      expect(value).toEqual(10.33);
    });
    describe('allow undefined', () => {
      it('returns the environment variable as an number', () => {
        process.env.TEST_NUMBER = '10.33';
        const value = getNumber('TEST_NUMBER', { allowUndefined: true });
        expect(value).toEqual(10.33);
      });
    });
    describe('default is set', () => {
      it('returns the environment variable as an number', () => {
        process.env.TEST_NUMBER = '10.33';
        const value = getNumber('TEST_NUMBER', { default: 20 });
        expect(value).toEqual(10.33);
      });
    });
    describe('allow list is defined', () => {
      describe('environmental variable is in allow list', () => {
        it('return the environmental variable as a number', () => {
          process.env.TEST_NUMBER = '10.33';
          const value = getNumber('TEST_NUMBER', {
            allowList: [10.33, 20.33],
          });
          expect(value).toEqual(10.33);
        });
      });
      describe('environmental variable is NOT in allow list', () => {
        it('throws an error', () => {
          process.env.TEST_NUMBER = '30.33';
          expect(() => {
            getNumber('TEST_NUMBER', { allowList: [10, 20] });
          }).toThrow(new ListValueConfigError('TEST_NUMBER', 30.33, [10, 20]));
        });
      });
    });
  });
  describe('environment variable is set to an empty string', () => {
    it('throws an error', () => {
      process.env.TEST_NUMBER = '';
      expect(() => {
        getNumber('TEST_NUMBER');
      }).toThrow(new NotDefinedConfigError('TEST_NUMBER'));
    });

    describe('allow undefined', () => {
      it('returns undefined', () => {
        process.env.TEST_NUMBER = '';
        const value = getNumber('TEST_NUMBER', { allowUndefined: true });
        expect(value).toBeUndefined();
      });
    });

    describe('default is set', () => {
      it('returns the default', () => {
        process.env.TEST_NUMBER = '';
        const value = getNumber('TEST_NUMBER', { default: 20.22 });
        expect(value).toEqual(20.22);
      });
    });
  });
  describe('environment variable is not set', () => {
    it('throws an error', () => {
      expect(() => {
        getNumber('TEST_NUMBER');
      }).toThrow(new NotDefinedConfigError('TEST_NUMBER'));
    });

    describe('allow undefined', () => {
      it('returns undefined', () => {
        const value = getNumber('TEST_NUMBER', { allowUndefined: true });
        expect(value).toBeUndefined();
      });
    });

    describe('default is set', () => {
      it('returns the default', () => {
        const value = getNumber('TEST_NUMBER', { default: 20.22 });
        expect(value).toEqual(20.22);
      });
    });
  });
});
