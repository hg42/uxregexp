
function eq(a,b) { return JSON.stringify(a) === JSON.stringify(b); }

function test(a,b)
  {
  if(eq(a,b))
    console.log("ok:     " + JSON.stringify(a));
  else
    console.log("FAILED: " + JSON.stringify(a) + "\n  want: " + JSON.stringify(b));
  }

require("regexp-match-indices/auto");
const XRegExp = require('xregexp');

var re = XRegExp('                            \n\
            (?<year>  [0-9]{4} ) -?  # year   \n\
            (?<month> [0-9]{2} ) -?  # month  \n\
            (?<day>   [0-9]{2} )     # day    \n\
            |                                 \n\
            (?<month2> [0-9]{2} ) /  # month  \n\
            (?<day2>   [0-9]{2} ) /  # day    \n\
            (?<year2>  [0-9]{4} )    # year   \n\
            ',
            'x'
          );


var matches = XRegExp.exec("abc1961-09-04def", re);

console.log('matches = ', matches);
console.log('indices = ', matches.indices);
console.log('year  = ', matches.year)
console.log('month = ', matches.month)
console.log('day   = ', matches.day)
//console.log(JSON.stringify(matches, null, '  '));

var groups = re.exec("abc1961-09-04def");

test(groups, ["1961-09-04","1961","09","04",null,null,null]);
test(groups.indices, [[3,13],[3,7],[8,10],[11,13],null,null,null]);

var re = XRegExp(/([0-9]{4})(-?([0-9]{2}))-?([0-9]{2})/);

var groups = re.exec("abc1961-09-04def");

test(groups, ["1961-09-04", "1961", "-09", "09", "04"]);
test(groups.indices, [[3,13],[3,7],[7,10],[8,10],[11,13]]);
