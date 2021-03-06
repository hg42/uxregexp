
require('../polyfill/string-padend');

var text = 'abcdefghijklmnopqrstuvwxyz';
var re = '/   \n  (?:bcd) ( [ex-z] .*  # comment with special chars ([*? \n  (g.* (?<I>i) ) \n j (?<K>k) ) l (?:mn)? (opq)  r s t /x  \n   ';

//RegExpTree = require('regexp-tree');
//
// var ast = RegExpTree.parse(re);
//
// console.log(JSON.stringify(ast, null, '  '));
//
//
// var result = RegExpTree.exec(re, text);
//
// console.log(JSON.stringify(result, null, '  '));
//
// var regexp = RegExpTree.compatTranspile(re).toRegExp();
// var result2 = regexp.exec(text);
//
// console.log(JSON.stringify(result2, null, '  '));

UXRegExp = require('..');

var uxre = new UXRegExp(re);
var matches = uxre.exec(text);

var text = '';

showGroup = function(matches, name) {
  var text = matches.input;
  var value = null;
  if(matches.groups[name])
    value = matches.groups[name];
  else
    value = matches[name];
  var index = matches.infos[name].index;
  console.log(
    (JSON.stringify(name) + ':').padEnd(5) +
    '\'' + value + '\'' +
    ' (' + index + ')' +
    '\n' +
    ' '.padEnd(5) +
    '\'' +  text.substr(index, value.length) + '\''
  );
};

console.log(JSON.stringify(matches, null, '  '));

showGroup(matches, 'all');
showGroup(matches, 'pre');
showGroup(matches, 'post');
for (var name of matches.names) {
  showGroup(matches, name);
}
