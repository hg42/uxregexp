
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('simple nesting', () => {
    var uxre = new UXRegExp('/a(b(c(d)))/');
    it('should match', () => {
      var result = uxre.exec('abcd');
      expect(result.all).toBe('abcd');
    });
    it('should have correct parents', () => {
      expect(uxre.parents[3]).toEqual([2,1]);
      expect(uxre.parents[2]).toEqual([1]);
      expect(uxre.parents[1]).toEqual([]);
    });
  });
  describe('nested groups', () => {
    var uxre = new UXRegExp('/a(?:bcd)([xey].*(g.*(?<I>i))j(?<K>k))l(?<MN>mn)?(opq)rst/');
    it('should have euql values and extracted values', () => {
      var result = uxre.exec('PREabcdefghijklmnopqrstPOST');
      for (var name of [1, 2, 6, 'I', 'K', 'MN']) {
        var idx = result.infos[name].index;
        var len = result.groups[name].length;
        expect(result.groups[name]).toBe(result.input.slice(idx, idx+len));
      }
    });
    it('should have correct parents', () => {
      expect(uxre.parents[1]).toEqual([]);
      expect(uxre.parents[2]).toEqual([1]);
      expect(uxre.parents[6]).toEqual([]);
      expect(uxre.parents['I']).toEqual([2, 1]);
      expect(uxre.parents['K']).toEqual([1]);
      expect(uxre.parents['MN']).toEqual([-40008]);
    });
  });
});
