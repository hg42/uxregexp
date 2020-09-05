
require.main.paths.unshift("../..");

function show(x) {
  console.log(JSON.stringify(x));
}

if(0) {
  var t = '1234567890';
  var s = new String(t.substring(2, 5));
  s.x = 'xxx';
  show('' + s);      // "345"
  show(s + '');      // "345"
  show('345' + 1);   // "3451"
  show(s + 1);       // "3451"
  show(1 + '345');   // "1345"
  show(1 + s);       // "1345"
  show(s.x);         // "xxx"
  show(typeof s);    // "object" (!)
  show(typeof Object.prototype.toString.call(s));  // "string"
  show(typeof Object.prototype.toString.call(t));  // "string"
  show(typeof Object.prototype.toString.call(55)); // "string" (!)
  // show(s.constructor); // ES6
  // show(t.constructor); // ES6
  show(s instanceof String); // true
  show(t instanceof String); // false
}

if(0) {
  var matches = /a(b).(d)e/.exec('abcde');
  console.log(matches);
}

if(1) {
  var matches = /a(b).(d)e/.matchAll('abcde');
  console.log(matches);
}

if(0) {
  var matches = /a(b)(c)d/.exec('abcd');
  var index_b = matches.index + matches[0].indexOf(matches[1]);
  var index_c = matches.index + matches[0].indexOf(matches[2]);
  show([index_b, index_c]);
}

if(0) {
  var matches = /a(b)(b)c/.exec('abbc');
  var index_b1 = matches.index + matches[0].indexOf(matches[1]);
  var index_b2 = matches.index + matches[0].indexOf(matches[2]);
  show([index_b1, index_b2]);
}

if(0) {
  var matches = /(a)(b)(b)c/.exec('abbc');
  var index_b1 = matches.index + matches[1].length;
                 // start of match + length of 'a'
  var index_b2 = matches.index + matches[1].length + matches[2].length;
                 // start of match + length of 'a' and length of first 'b'
  show([index_b1, index_b2]);
}

if(0) {
  UXRegExp = require('uxregexp');
  var matches = new UXRegExp('/a(b)(?:c)(d)(?<E>e)f/').exec('PREabcdefPOST');
  show(matches);
}

if(0) {
  UXRegExp = require('uxregexp');
  var matches = new UXRegExp('/a(b)(?:c)(d)(?:e)f/').exec('PREabcdefPOST');
  show([matches.all, matches.grouped]);
}

if(0) {
  var jsre = /(\d)(\d)/g;
  var text = "abc1234567890xyz";
  show(["string.match", text.match(jsre), jsre.lastIndex]);
  show(["regexp.exec",  jsre.exec(text),  jsre.lastIndex]);
  show(["regexp.exec",  jsre.exec(text),  jsre.lastIndex]);
}

if(0) {
  var re = /(?<name>abc)/;  // SyntaxError: Invalid regular expression
}
