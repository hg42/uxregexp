
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('x-flag', () => {
    it('should ignore comments and whitespace', () => {
      var uxre = new UXRegExp('/\n\
                              x    # some comment\n\
                              y z  # some comment with ])(.*?[^ special characters\n\
                              /x\n\
                          ');
      expect(uxre.re.toString()).toBe('/(xyz)/');
      var result = uxre.exec('xyz');
      expect(result.all).toBe('xyz');
      var x = 1/0;
    });
    it('should allow writing complex multi-line expressions (no comments)', () => {
      var uxre = new UXRegExp('/  a                                           \
                        (?:bcd) ( [xey] .*                                    \
                                 (g.* (?<I>i) )                               \
                                 j (?<K>k)                                    \
                               ) l (?<MN>mn)? (opq)  r s t                    \
                        /x');
      // TODO: expect(uxre.re.toString()).toBe('/(a(bcd))(([xey].*)((g.*)(i))(j)(k))(l(mn)?)(opq)(rst)/');
               expect(uxre.re.toString()).toBe('/(a)((bcd))(([xey].*)((g.*)(i))(j)(k))(l)(((mn))?)((opq))(rst)/');
    });
    it('should allow complex expressions with real newlines and comments', () => {
      var uxre = new UXRegExp('/  a                                           \n\
                        (?:bcd) ( [xey] .*  # comment with special chars ([*? \n\
                                 (g.* (?<I>i) )                               \n\
                                 j (?<K>k)                                    \n\
                               ) l (?<MN>mn)? (opq)  r s t                    \n\
                        /x');
      // TODO: expect(uxre.re.toString()).toBe('/(a(bcd))(([xey].*)((g.*)(i))(j)(k))(l(mn)?)(opq)(rst)/');
               expect(uxre.re.toString()).toBe('/(a)((bcd))(([xey].*)((g.*)(i))(j)(k))(l)(((mn))?)((opq))(rst)/');
    });
  });
});
