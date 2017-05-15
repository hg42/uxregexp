
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('constructor', () => {

    it('should accept regexp as string with slashes', () => {
      var uxre = new UXRegExp('/abc/i');
      expect(uxre.re.toString()).toBe('/(abc)/i');
    });
    it('should accept regexp as string with slashes and options as string', () => {
      var uxre = new UXRegExp('/abc/', 'i');
      expect(uxre.re.toString()).toBe('/(abc)/i');
    });
    it('should accept regexp as string with slashes and options.flags', () => {
      var uxre = new UXRegExp('/abc/', {flags: 'i'});
      expect(uxre.re.toString()).toBe('/(abc)/i');
    });

    it('should accept regexp as simple string', () => {
      var uxre = new UXRegExp('abc');
      expect(uxre.re.toString()).toBe('/(abc)/');
    });
    it('should accept regexp as simple string and flags as string', () => {
      var uxre = new UXRegExp('abc', 'i');
      expect(uxre.re.toString()).toBe('/(abc)/i');
    });
    it('should accept regexp as simple string and options.flags', () => {
      var uxre = new UXRegExp('abc', {flags: 'i'});
      expect(uxre.re.toString()).toBe('/(abc)/i');
    });

    it('should accept regexp as javascript regexp', () => {
      var uxre = new UXRegExp(/abc/i);
      expect(uxre.re.toString()).toBe('/(abc)/i');
    });
    it('should accept regexp as javascript regexp and flags as string', () => {
      var uxre = new UXRegExp(/abc/, 'i');
      expect(uxre.re.toString()).toBe('/(abc)/i');
    });
    it('should accept regexp as javascript and options.flags', () => {
      var uxre = new UXRegExp(/abc/, {flags: 'i'});
      expect(uxre.re.toString()).toBe('/(abc)/i');
    });
  });
});
