
const RedRegExp = require('../red-regexp');

describe('RedRegExp:', () => {
  describe('x-flag', () => {
    var redRE = new RedRegExp('/\n\
                            x    # some comment\n\
                            y z  # some comment with (.*?[^][) special characters\n\
                            /x\n\
                        ');
    it('should ignore comments and whitespace', () => {
      expect(redRE.re.toString()).toBe('/(xyz)/');
      var result = redRE.exec('xyz');
      expect(result.all).toBe('xyz');
      var x = 1/0;
    });
  });
});
