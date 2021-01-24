
require('regexp-match-indices/auto');

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

test(groups, ["1961-09-04", "1961", "09", "04"]);
test(groups.indices, [[3,13],[3,7],[8,10],[11,13]]);

var re = new RegExp(/([0-9]{4})(-?([0-9]{2}))-?([0-9]{2})/);

var groups = re.exec("abc1961-09-04def");

test(groups, ["1961-09-04", "1961", "-09", "09", "04"]);
test(groups.indices, [[3,13],[3,7],[7,10],[8,10],[11,13]]);
