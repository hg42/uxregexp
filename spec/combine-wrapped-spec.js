
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('wrapped expressions', () => {
    it('single elements should be without group', () => {
      var uxre = new UXRegExp('[abc]');
      expect(uxre.re.toString()).toBe('/[abc]/');
    });
    // it('should be simple if possible', () => {
    //   var uxre = new UXRegExp('a[b]x(?:.*)[c-d]*yz?');
    //   expect(uxre.re.toString()).toBe('/(a[b]x.*[c-d]*yz?)/');
    // });
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
