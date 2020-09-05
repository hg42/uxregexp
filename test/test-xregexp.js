
XRegExp = require('xregexp');

re = new XRegExp('                              \n\
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

console.log(XRegExp.split("abc1961-09-04def", re));
