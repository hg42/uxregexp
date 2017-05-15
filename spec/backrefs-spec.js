
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('numbered backreferences (...)\\1', () => {
    it('should match', () => {
      var uxre = new UXRegExp('(?:a)(b)(c).(\\2)(\\1)');
      expect(uxre.re.toString()).toBe('/(a)(b)(c)(.)(\\3)(\\2)/');
      var matches = uxre.exec('PREabcxcbaPOST');
      expect(matches.all).toBe('abcxcb');
      expect(matches.groups[1]).toBe(matches.groups[4]);
      expect(matches.groups[2]).toBe(matches.groups[3]);
    });
    // it('should match forward', () => {
    //   var matches = new UXRegExp('(\\2).(c)').exec('PREabcxcyzPOST');
    //   expect(matches.all).toBe('cxc');
    //   expect(matches.groups[2]).toBe(matches.groups[1]);
    // });
  });
  describe('named backreferences (?<name>...)\\k<name>', () => {
    it('should match', () => {
      var uxre = new UXRegExp('(?:a)(?<B>b)(?<C>c).(?<backC>\\k<C>)(?<backB>\\k<B>)')
      var matches = uxre.exec('PREabcxcbaPOST');
      expect(uxre.re.toString()).toBe('/(a)(b)(c)(.)(\\3)(\\2)/');
      expect(matches.all).toBe('abcxcb');
      expect(matches.groups.B).toBe(matches.groups.backB);
      expect(matches.groups.C).toBe(matches.groups.backC);
    });
  });
})
