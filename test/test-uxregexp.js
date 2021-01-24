
function eq(a,b) { return JSON.stringify(a) === JSON.stringify(b); }

function test(a,b)
  {
  if(eq(a,b))
    console.log("ok:     " + JSON.stringify(a));
  else
    console.log("FAILED: " + JSON.stringify(a) + "\n  want: " + JSON.stringify(b));
  }

const UXRegExp = require('..');

var re = new UXRegExp('                       \n\
            (?<year>  [0-9]{4} ) -?  # year   \n\
            (?<month> [0-9]{2} ) -?  # month  \n\
            (?<day>   [0-9]{2} )     # day    \n\
            |                                 \n\
            (?<month> [0-9]{2} ) /   # month  \n\
            (?<day>   [0-9]{2} ) /   # day    \n\
            (?<year>  [0-9]{4} )     # year   \n\
            ',
            'x'
          );


var matches = re.exec("abc1961-09-04def", re);

console.log('matches = ', matches);
//console.log('indices = ', matches.indices);
console.log('year  = ', matches.groups.year)
console.log('month = ', matches.groups.month)
console.log('day   = ', matches.groups.day)
//console.log(JSON.stringify(matches, null, '  '));
