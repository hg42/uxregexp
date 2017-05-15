
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('g-flag', () => {
    it('should give single matches with exec', () => {
      var uxre = new UXRegExp('[xyz]', 'g');
      var text = 'axbyczd';
      expect(uxre.re.toString()).toBe('/[xyz]/g');
      var matches = uxre.exec(text);
      expect(matches.all).toBe('x');
      matches = uxre.exec(text);
      expect(matches.all).toBe('y');
      matches = uxre.exec(text);
      expect(matches.all).toBe('z');
    });
    it('should collect matches', () => {
      // text.match(uxre) -> [...]
    });
  });
});
