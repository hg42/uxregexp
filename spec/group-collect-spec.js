
const RedRegExp = require('../red-regexp');

describe('RedRegExp:', () => {
  describe('group collection', () => {
    it('should collect groups with same names', () => {
      var redRE = new RedRegExp('/a(?<group>b)(?<group>c)(?<group>d)e/');
      var result = redRE.exec('PREabcdePOST');
      expect(result.groups.group).toEqual(['b', 'c', 'd']);
      expect(result.infos.group).toEqual([{index: 4}, {index: 5}, {index: 6}]);
    });
    it('should ignore null groups in disjunction ("|")', () => {
      var redRE = new RedRegExp('/a((?<group>b)|(?<group>c)|(?<group>d))e/');
      var result = redRE.exec('PREabePOST');
      expect(result.groups.group).toEqual('b');
      expect(result.infos.group).toEqual({index: 4});
    });
    it('should collect matching but empty group', () => {
      var redRE = new RedRegExp('/a((?<group>b)(?<group>c?)(?<group>d))e/');
      var result = redRE.exec('PREabdePOST');
      expect(result.groups.group).toEqual(['b', '', 'd']);
      expect(result.infos.group).toEqual([{index: 4}, {index: 5}, {index: 5}]);
    });
    it('should ignore null group in collected group', () => {
      var redRE = new RedRegExp('/a(?<group>b)?(?<group>c)?(?<group>d)?e/');
      var result = redRE.exec('PREabdePOST');
      expect(result.groups.group).toEqual(['b', 'd']);
      expect(result.infos.group).toEqual([{index: 4}, {index: 5}]);
    });
  });
});
