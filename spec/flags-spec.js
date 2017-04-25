
const XRE = require('../xre');

describe('XRE:', () => {
  describe('flags', () => {
    it('should ignore comments and whitespace', () => {
      var xre = new XRE('\n\
                              x    # some comment\n\
                              y z  # some comment with (.*?[^][) special characters\n\
                              \n\
                          ', 'iixx');
      expect(xre.re.toString()).toBe('/(xyz)/i');
    });
  });
});
