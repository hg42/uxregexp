
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('flags', () => {
    it('should be sorted and be unique', () => {
      var uxre = new UXRegExp('/ x y z /m', 'ixig');
      expect(uxre.re.toString()).toBe('/(xyz)/gim');
    });
  });
});
