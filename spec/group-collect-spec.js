
const XRE = require('../xre');

describe('XRE:', () => {
  describe('group collection', () => {
    it('should collect groups with same names', () => {
      var xre = new XRE('/a(?<group>b)(?<group>c)(?<group>d)e/');
      var result = xre.exec('preabcdepost');
      expect(result.groups.group).toEqual(['b', 'c', 'd']);
      expect(result.infos.group).toEqual([{index: 4}, {index: 5}, {index: 6}]);
    });
    it('should ignore null groups in disjunction ("|")', () => {
      var xre = new XRE('/a((?<group>b)|(?<group>c)|(?<group>d))e/');
      var result = xre.exec('preabepost');
      expect(result.groups.group).toEqual('b');
      expect(result.infos.group).toEqual({index: 4});
    });
    it('should collect matching but empty group', () => {
      var xre = new XRE('/a((?<group>b)(?<group>c?)(?<group>d))e/');
      var result = xre.exec('preabdepost');
      expect(result.groups.group).toEqual(['b', '', 'd']);
      expect(result.infos.group).toEqual([{index: 4}, {index: 5}, {index: 5}]);
    });
    it('should ignore null group in collected group', () => {
      var xre = new XRE('/a(?<group>b)?(?<group>c)?(?<group>d)?e/');
      var result = xre.exec('preabdepost');
      expect(result.groups.group).toEqual(['b', 'd']);
      expect(result.infos.group).toEqual([{index: 4}, {index: 5}]);
    });
  });
});
