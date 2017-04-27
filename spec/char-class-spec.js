
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('char class', () => {
    it('should use "." as simple char', () => {
      var uxre = new UXRegExp('/[.]+/');
      var result = uxre.exec('a...b');
      expect(result.all).toBe('...');
    });
    it('should use "|" as simple char', () => {
      var uxre = new UXRegExp('/[.|,]+/');
      var result = uxre.exec('a.|,|.|,b');
      expect(result.all).toBe('.|,|.|,');
    });
  });
});
