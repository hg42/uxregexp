
const RedRegExp = require('../red-regexp');

describe('RedRegExp:', () => {
  describe('flags', () => {
    it('should ignore comments and whitespace', () => {
      var redRE = new RedRegExp('\n\
                              x    # some comment\n\
                              y z  # some comment with (.*?[^][) special characters\n\
                              \n\
                          ', 'iixx');
      expect(redRE.re.toString()).toBe('/(xyz)/i');
    });
  });
});
