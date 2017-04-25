
const XRE = require('../xre');

describe('XRE:', () => {
  describe('x-flag', () => {
    var xre = new XRE('/\n\
                            x    # some comment\n\
                            y z  # some comment with (.*?[^][) special characters\n\
                            /x\n\
                        ');
    it('should ignore comments and whitespace', () => {
      expect(xre.re.toString()).toBe('/(xyz)/');
      var result = xre.exec('xyz');
      expect(result.all).toBe('xyz');
      var x = 1/0;
    });
  });
});
