
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('test(...)', () => {
    it('should return false if no match', () => {
      var uxre = new UXRegExp('abc');
      var result = uxre.test('xyz');
      expect(result).toBe(false);
    });
    it('should return true if match', () => {
      var uxre = new UXRegExp('abc');
      var result = uxre.test('PREabcPOST');
      expect(result).toBe(true);
    });
  });
});
