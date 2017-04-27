
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('result.all', () => {
    it('should include all matching parts', () => {
      var uxre = new UXRegExp('/a(b)(?:c)(?<D>d)(?:e)f/');
      var result = uxre.exec('PREabcdefPOST');
      expect(result.all).toBe('abcdef');
    });
  });
  describe('result.pre/post', () => {
    it('should return parts surrounding match', () => {
      var uxre = new UXRegExp('/a(b)(?:c)(?<D>d)(?:e)f/');
      var result = uxre.exec('PREabcdefPOST');
      expect(result.pre).toBe('PRE');
      expect(result.post).toBe('POST');
    });
  });
  describe('result.grouped', () => {
    it('should only collect capturing groups', () => {
      var uxre = new UXRegExp('/a(b)(?:c)(?<D>d)(?:e)f/');
      var result = uxre.exec('PREabcdefPOST');
      expect(result.grouped).toBe('bcd');
    });
  });
});
