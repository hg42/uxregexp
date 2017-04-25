
const XRE = require('../xre');

describe('XRE:', () => {
  describe('simple nesting', () => {
    var xre = new XRE('/a(b(c(d)))/');
    it('should ignore comments and whitespace', () => {
      var result = xre.exec('abcd');
      expect(result.all).toBe('abcd');
    });
  });
  describe('value and extracted value', () => {
    var xre = new XRE('/  a \n  (?:bcd) ( [xey] .*  # comment with special chars ([*? \n  (g.* (?<I>i) ) \n j (?<K>k) ) l (?:mn)? (opq)  r s t /x  \n   ');
    it('should be equal', () => {
      var result = xre.exec('PREabcdefghijklmnopqrstPOST');
      expect(result.groups[4.2]).toBe('mn');
      var name = "4.2";
      var idx = result.infos[name].index;
      var len = result.groups[name].length;
      expect(result.input.slice(idx, idx+len)).toBe('mn');
    });
  });
});
