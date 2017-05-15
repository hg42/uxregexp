
const UXRegExp = require('../uxregexp');

describe('UXRegExp:', () => {
  describe('debug', () => {
    it('should be disabled', () => {
      var uxre = new UXRegExp('/xyz/', { debug: 1 });
      UXRegExp.showo("showo")
      UXRegExp.showt("showt")
    });
  });
});
