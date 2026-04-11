
const UXRegExp = require('../uxregexp');

describe('UXRegExp: debug', () => {
  describe('debug', () => {
    it('should be disabled', () => {
      var uxre = new UXRegExp('/xyz/', { debug: 1 });
    });
  });
});
