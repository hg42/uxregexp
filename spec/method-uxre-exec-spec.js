
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('exec(...)', () => {
    it('should return null if no match', () => {
      var uxre = new UXRegExp('abc');
      var result = uxre.exec('xyz');
      expect(result).toBe(null);
    });
    describe('with g-flag', () => {
      it('should work incremental', () => {
        var uxre = new UXRegExp('/(\\d)(\\d)/', 'g');
        var text = "PRE1234567890POST";
        var result = uxre.exec(text);
        expect(result.all).toBe('12');
        result = uxre.exec(text);
        expect(result.all).toBe('34');
        expect(result.groups[1]).toBe('3');
        expect(result.groups[2]).toBe('4');
      });
    });
  });
});
