
var matchIndex = require('match-index');

function eq(a,b) { return JSON.stringify(a) === JSON.stringify(b); }
function test(a,b)
  {
  if(eq(a,b))
    console.log("ok:     " + JSON.stringify(a));
  else
    console.log("FAILED: " + JSON.stringify(a) + "\n  want: " + JSON.stringify(b));
  }

var groups = matchIndex.matchCaptureGroupAll("abc1961-09-04def",
              /([0-9]{4})-?([0-9]{2})-?([0-9]{2})/
              );

test(groups, [{"text":"1961","index":3},{"text":"09","index":8},{"text":"04","index":11}]);

var groups = matchIndex.matchCaptureGroupAll("abc1961-09-04def",
              /([0-9]{4})(-?([0-9]{2}))-?([0-9]{2})/
              );

test(groups, [{"text":"1961","index":3},{"text":"-09","index":7},{"text":"09","index":9},{"text":"04","index":11}]);
