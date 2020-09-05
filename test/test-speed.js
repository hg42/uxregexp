
Timer = require('perfy');
XRegExp = require('xregexp');
UXRegExp = require('..');

var name;
var re;


var text = '2015-02-22 '.repeat(100000);

var pattern = '                              \n\
              (?<year>  [0-9]{4} ) -?  # year   \n\
              (?<month> [0-9]{2} ) -?  # month  \n\
              (?<day>   [0-9]{2} )     # day    \n\
              |                                 \n\
              (?<month2> [0-9]{2} ) /  # month  \n\
              (?<day2>   [0-9]{2} ) /  # day    \n\
              (?<year2>  [0-9]{4} )    # year   \n\
              ';

name = "xregexp-create ";

Timer.start(name);
re = new XRegExp(pattern, 'xg');
console.log(Timer.end(name).summary);

name = "xregexp-exec   ";

var count = 0;
Timer.start(name);
while(matches = re.exec(text)) {
  //count += 1
}
//console.log("count=" + count);
console.log(Timer.end(name).summary);

console.log();



name = "uxregexp-create";

Timer.start(name);
re = new UXRegExp(pattern, 'xg')
console.log(Timer.end(name).summary)

name = "uxregexp-exec  ";

Timer.start(name);
count = 0
while(matches = re.exec(text)) {
  //count += 1
}
//console.log("count=" + count);
console.log(Timer.end(name).summary);

console.log();



name = "jsregexp-create";

Timer.start(name);
re = new RegExp(re.re);  // compare to UXRegExp transformed javascript regexp
console.log(Timer.end(name).summary);

name = "jsregexp-exec  ";

Timer.start(name);
count = 0
while(matches = re.exec(text)) {
  //count += 1
}
//console.log("count=" + count);
console.log(Timer.end(name).summary);
