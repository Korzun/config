import { NotDefinedConfigError, ListValueConfigError } from './error';
import { getString } from './string';

describe('getString', () => {
  let env: Record<string, string | undefined>;
  beforeEach(() => {
    env = Object.assign({}, process.env);
  });
  Object.assign({}, process.env);
  afterEach(() => {
    process.env = env;
  });

  describe('environment variable is set', () => {
    it('returns the environment variable as an string', () => {
      process.env.TEST_STRING = 'foo';
      const value = getString('TEST_STRING');
      expect(value).toEqual('foo');
    });
    describe('allow undefined', () => {
      it('returns the environment variable as an string', () => {
        process.env.TEST_STRING = 'foo';
        const value = getString('TEST_STRING', { allowUndefined: true });
        expect(value).toEqual('foo');
      });
    });
    describe('default is set', () => {
      it('returns the environment variable as an string', () => {
        process.env.TEST_STRING = 'foo';
        const value = getString('TEST_STRING', { default: 'bar' });
        expect(value).toEqual('foo');
      });
    });
    describe('allow list is defined', () => {
      describe('environmental variable is in allow list', () => {
        it('return the environmental variable as a string', () => {
          process.env.TEST_STRING = 'foo';
          const value = getString('TEST_STRING', {
            allowList: ['foo', 'bar'],
          });
          expect(value).toEqual('foo');
        });
      });
      describe('environmental variable is NOT in allow list', () => {
        it('throws an error', () => {
          process.env.TEST_STRING = 'baz';
          expect(() => {
            getString('TEST_STRING', { allowList: ['foo', 'bar'] });
          }).toThrow(
            new ListValueConfigError('TEST_STRING', 'baz', ['foo', 'bar']),
          );
        });
      });
    });
  });
  describe('environment variable is set to an empty string', () => {
    it('throws an error', () => {
      process.env.TEST_STRING = '';
      expect(() => {
        getString('TEST_STRING');
      }).toThrow(new NotDefinedConfigError('TEST_STRING'));
    });

    describe('allow undefined', () => {
      it('returns undefined', () => {
        process.env.TEST_STRING = '';
        const value = getString('TEST_STRING', { allowUndefined: true });
        expect(value).toBeUndefined();
      });
    });

    describe('default is set', () => {
      it('returns the default', () => {
        process.env.TEST_STRING = '';
        const value = getString('TEST_STRING', { default: 'bar' });
        expect(value).toEqual('bar');
      });
    });
  });
  describe('environment variable is not set', () => {
    it('throws an error', () => {
      expect(() => {
        getString('TEST_STRING');
      }).toThrow(new NotDefinedConfigError('TEST_STRING'));
    });

    describe('allow undefined', () => {
      it('returns undefined', () => {
        const value = getString('TEST_STRING', { allowUndefined: true });
        expect(value).toBeUndefined();
      });
    });

    describe('default is set', () => {
      it('returns the default', () => {
        const value = getString('TEST_STRING', { default: 'bar' });
        expect(value).toEqual('bar');
      });
    });
  });
});
