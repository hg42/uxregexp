
const RedRegExp = require('../red-regexp');

describe('RedRegExp:', () => {
  describe('result.all', () => {
    it('should include all matching parts', () => {
      var redRE = new RedRegExp('/a(b)(?:c)(?<D>d)(?:e)f/');
      var result = redRE.exec('PREabcdefPOST');
      expect(result.all).toBe('abcdef');
    });
  });
  describe('result.pre/post', () => {
    it('should return parts surrounding match', () => {
      var redRE = new RedRegExp('/a(b)(?:c)(?<D>d)(?:e)f/');
      var result = redRE.exec('PREabcdefPOST');
      expect(result.pre).toBe('PRE');
      expect(result.post).toBe('POST');
    });
  });
  describe('result.grouped', () => {
    it('should only collect capturing groups', () => {
      var redRE = new RedRegExp('/a(b)(?:c)(?<D>d)(?:e)f/');
      var result = redRE.exec('PREabcdefPOST');
      expect(result.grouped).toBe('bcd');
    });
  });
});
