var UXRegExp = require("uxregexp")

var uxre = new UXRegExp('                           \n\
                  (?<year>  [0-9]{4} ) -?  # year   \n\
                  (?<month> [0-9]{2} ) -?  # month  \n\
                  (?<day>   [0-9]{2} )     # day    \n\
                  |                                 \n\
                  (?<month> [0-9]{2} ) /   # month  \n\
                  (?<day>   [0-9]{2} ) /   # day    \n\
                  (?<year>  [0-9]{4} )     # year   \n\
                  ',
                  'xg'
                  );

var match = uxre.exec("2020-12-31");

return match;
