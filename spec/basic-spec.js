
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
    it('should accept regexp as simple string with multiple embedded slashes', () => {
      var uxre = new UXRegExp('a/b/c');
      expect(uxre.re.toString()).toBe('/(a\\/b\\/c)/');
    });
    it('should accept regexp as simple string with more complicated multiple embedded slashes', () => {
      var uxre = new UXRegExp('                           \n\
                        (?<year>  [0-9]{4} ) -?  # year   \n\
                        (?<month> [0-9]{2} ) -?  # month  \n\
                        (?<day>   [0-9]{2} )     # day    \n\
                        |                                 \n\
                        (?<month> [0-9]{2} ) /   # month  \n\
                        (?<day>   [0-9]{2} ) /   # day    \n\
                        (?<year>  [0-9]{4} )     # year   \n\
                        ',
                        'xg'
                        )
      expect(uxre.re.toString()).toBe('/([0-9]{4})(-?)([0-9]{2})(-?)([0-9]{2})|([0-9]{2})(\\/)([0-9]{2})(\\/)([0-9]{4})/g');
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
