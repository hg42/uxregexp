
const RedRegExp = require('../red-regexp');

describe('RedRegExp:', () => {
  var matches = new RedRegExp('(?:a)(?:b)(c)(?<X>x)(?<Y>y)(?<Z>z)(?:d)(e)(?:f)').exec('PREabcxyzdefPOST');
  describe('non-capturing groups (?:...)', () => {
    it('should not be counted', () => {
      expect(matches.groups[1]).toBe('c');
    });
  });
  describe('named groups', () => {
    it('should provide their value in matches.groups[name] (?<name>...)', () => {
      expect(matches.groups.X).toBe('x');
      expect(matches.groups.Y).toBe('y');
      expect(matches.groups.Z).toBe('z');
    });
    it('should increment the number for numbered groups', () => {
      expect(matches.groups[5]).toBe('e');
    });
    // it('should also be added as numbered group', () => {
    //   expect(matches.groups[2]).toBe('x');
    //   expect(matches.groups[3]).toBe('y');
    //   expect(matches.groups[4]).toBe('z');
    // });
  });
  describe('other results:', () => {
    it('all', () => {
      expect(matches.all).toBe('abcxyzdef');
    });
    it('pre', () => {
      expect(matches.pre).toBe('PRE');
    });
    it('post', () => {
      expect(matches.post).toBe('POST');
    });
  });
  describe('additional info:', () => {
    it('names should be collected', () => {
      expect(matches.names).toEqual([ '1', 'X', 'Y', 'Z', '5' ]);
    });
    it('index should match input', () => {
      for(name of matches.names) {
        var start = matches.infos[name].index;
        var end = start + matches.groups[name].length;
        expect(matches.input.slice(start, end)).toBe(matches.groups[name]);
      }
    });
    it('pre', () => {
      expect(matches.pre).toBe('PRE');
    });
    it('post', () => {
      expect(matches.post).toBe('POST');
    });
  });
})
