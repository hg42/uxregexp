
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('wrapped expressions', () => {
    it('should be combined', () => {
      var uxre = new UXRegExp('a[b](x).*[c-d]*(?:y)(?:z)?');
      expect(uxre.re.toString()).toBe('/(a[b])(x)(.*[c-d]*)(y)((z)?)/');
    });
    it('should be combined if repetitions of combinable expressions', () => {
      var uxre = new UXRegExp('xy[a]?[b]*[c]+[d]{1,2}z');
      expect(uxre.re.toString()).toBe('/(xy[a]?[b]*[c]+[d]{1,2}z)/');
    });
  });
});
