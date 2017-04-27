
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('flags', () => {
    it('should ignore comments and whitespace', () => {
      var uxre = new UXRegExp('\n\
                              x    # some comment\n\
                              y z  # some comment with (.*?[^][) special characters\n\
                              \n\
                          ', 'iixx');
      expect(uxre.re.toString()).toBe('/(xyz)/i');
    });
  });
});
