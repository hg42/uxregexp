
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('simple nesting', () => {
    var uxre = new UXRegExp('/a(b(c(d)))/');
    it('should ignore comments and whitespace', () => {
      var result = uxre.exec('abcd');
      expect(result.all).toBe('abcd');
    });
  });
  describe('value and extracted value', () => {
    var uxre = new UXRegExp('/  a \n  (?:bcd) ( [xey] .*  # comment with special chars ([*? \n  (g.* (?<I>i) ) \n j (?<K>k) ) l (?<MN>mn)? (opq)  r s t /x  \n   ');
    it('should be equal', () => {
      var result = uxre.exec('PREabcdefghijklmnopqrstPOST');
      var name = 'MN';
      var idx = result.infos[name].index;
      var len = result.groups[name].length;
      expect(result.groups[name]).toBe('mn');
      expect(result.input.slice(idx, idx+len)).toBe('mn');
    });
  });
});
