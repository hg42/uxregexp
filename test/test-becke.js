
var RegExp = require('becke-ch--regex--s0-0-v1--base--pl--lib');

function eq(a,b) { return JSON.stringify(a) === JSON.stringify(b); }

function test(a,b)
  {
  if(eq(a,b))
    console.log("ok:     " + JSON.stringify(a));
  else
    console.log("FAILED: " + JSON.stringify(a) + "\n  want: " + JSON.stringify(b));
  }

var re = new RegExp(/([0-9]{4})-?([0-9]{2})-?([0-9]{2})/);

var groups = re.exec("abc1961-09-04def");

//test(groups, [ { text: '1961', index: 3 }, { text: '09', index: 8 }, { text: '04', index: 11 } ]);
test(groups, ["1961-09-04", "1961", "09", "04"]);
test(groups.index, [3, 3, 8, 11]);

var re = new RegExp(/([0-9]{4})(-?([0-9]{2}))-?([0-9]{2})/);

var groups = re.exec("abc1961-09-04def");

//test(groups, [ { text: '1961', index: 3 }, { text: '-09', index: 7 }, { text: '09', index: 8 }, { text: '04', index: 11 } ]);
test(groups, ["1961-09-04", "1961", "-09", "09", "04"]);
test(groups.index, [3, 3, 7, 8, 11]);
