
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('group collection', () => {
    it('should collect groups with same names', () => {
      var uxre = new UXRegExp('/a(?<group>b)(?<group>c)(?<group>d)e/');
      var result = uxre.exec('PREabcdePOST');
      expect(result.groups.group).toEqual(['b', 'c', 'd']);
      expect(result.infos.group).toEqual([{index: 4}, {index: 5}, {index: 6}]);
    });
    it('should ignore null groups in disjunction ("|")', () => {
      var uxre = new UXRegExp('/a((?<group>b)|(?<group>c)|(?<group>d))e/');
      var result = uxre.exec('PREabePOST');
      expect(result.groups.group).toBe('b');
      expect(result.infos.group).toEqual({index: 4});
    });
    it('should collect matching but empty group', () => {
      var uxre = new UXRegExp('/a((?<group>b)(?<group>c?)(?<group>d))e/');
      var result = uxre.exec('PREabdePOST');
      expect(result.groups.group).toEqual(['b', '', 'd']);
      expect(result.infos.group).toEqual([{index: 4}, {index: 5}, {index: 5}]);
    });
    it('should ignore null group in collected group', () => {
      var uxre = new UXRegExp('/a(?<group>b)?(?<group>c)?(?<group>d)?e/');
      var result = uxre.exec('PREabdePOST');
      expect(result.groups.group).toEqual(['b', 'd']);
      expect(result.infos.group).toEqual([{index: 4}, {index: 5}]);
    });
  });
});
