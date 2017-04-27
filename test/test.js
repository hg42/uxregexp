
if(1) {
  var matches = /a(b)(c)d/.exec("abcd");
  console.log(matches);
}

if(1) {
  var matches = /a(b)(c)d/.exec("abcd");
  var index_b = matches.index + matches[0].indexOf(matches[1]);
  var index_c = matches.index + matches[0].indexOf(matches[2]);
  console.log([index_b, index_c]); // -> [1, 2]
}

if(1) {
  var matches = /a(b)(b)c/.exec("abbc");
  var index_b1 = matches.index + matches[0].indexOf(matches[1]);
  var index_b2 = matches.index + matches[0].indexOf(matches[2]);
  console.log([index_b1, index_b2]); // -> [1, 1]
}

if(1) {
  var matches = /(a)(b)(b)c/.exec("abbc");
  var index_b1 = matches.index + matches[1].length;
                 // start of match + length of 'a'
  var index_b2 = matches.index + matches[1].length + matches[2].length;
                 // start of match + length of 'a' and length of first 'b'
  console.log([index_b1, index_b2]); // -> [1, 2]
  console.log([index_b1, index_b2]); // -> [1, 2]
}

if(1) {
  UXRegExp = require('../../uxregexp');
  var matches = new UXRegExp('/a(b)(?:c)(d)(?:e)f/').exec("PREabcdefPOST");
  console.log([matches.all, matches.grouped]); // -> ['abcd', 'bcd']
}
