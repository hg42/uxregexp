
const RedRegExp = require('../red-regexp');

describe('RedRegExp:', () => {
  describe('char class', () => {
    it('should use "." as simple char', () => {
      var redRE = new RedRegExp('/[.]+/');
      var result = redRE.exec('a...b');
      expect(result.all).toBe('...');
    });
    it('should use "|" as simple char', () => {
      var redRE = new RedRegExp('/[.|,]+/');
      var result = redRE.exec('a.|,|.|,b');
      expect(result.all).toBe('.|,|.|,');
    });
  });
});
