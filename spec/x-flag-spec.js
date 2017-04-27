
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('x-flag', () => {
    var uxre = new UXRegExp('/\n\
                            x    # some comment\n\
                            y z  # some comment with (.*?[^][) special characters\n\
                            /x\n\
                        ');
    it('should ignore comments and whitespace', () => {
      expect(uxre.re.toString()).toBe('/(xyz)/');
      var result = uxre.exec('xyz');
      expect(result.all).toBe('xyz');
      var x = 1/0;
    });
  });
});
