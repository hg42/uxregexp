
var RegExpTree = require('regexp-tree');
var PREFIX_NON_CAPTURING = '$$';

module.exports =
RedRegExp = (function() {

  var use_combine_wrapped_groups = 1;
  var use_collect_group = 1;
  
  var debug = 0;

  var show = function(x) {
    if(debug)
      console.log(x);
  };

  var showt = function(x) {
    show(JSON.stringify(x, null, '  '));
  };

  var showo = function(x) {
    show(JSON.stringify(x));
  };

  //---------------------------------------------------------------------------- constructor

  function RedRegExp(re, options) {

    showo(['input expression', re, options]);

    var flags = "";
    if(typeof options === 'string') {
      flags += options;
    } else if(typeof options === 'object') {
      if(options.flags)
        flags += options.flags;
    }

    if (re.includes('\n')) {
      flags += 'x';
    }

    // extract flags, set options and remove those not known by javascript

    if(typeof re === 'string') {
      var matches = /^\s*\/([\s\S]*)\/(\w*)\s*$/.exec(re);
      if (matches) {
        re = matches[1];
        flags = matches[2];
      }
      // escape '/'
      re = re.replace('/', '\\/');
      re = re.replace('\\\\/', '\\/');

      // santize flags (sort, uniq)
      flags = flags.split("")
                   .sort()
                   .filter(
                     function(e,i,a) {
                       return !i || e != a[i-1];
                     }
                   )
                   .join("");

      re = '/' + re + '/' + flags;
    }

    //showo(['after preprocess', re]);


    // build AST from re

    var ast = RegExpTree.parser.parse(re, flags);

    //showt(ast);


    // check if any named or capturing groups exist...

    var anyNamedOrCapturingGroup = 0;
    RegExpTree.traverse(ast, {

      Group: function(arg) {
        var node = arg.node;
        if (node.name || node.capturing) {
          return anyNamedOrCapturingGroup++;
        }
      }
    });


    // ...otherwise wrap whole expression in a group

    if (!anyNamedOrCapturingGroup) {
      // wrap whole expression in capturing group
      ast.body = {
        type: 'Group',
        capturing: true,
        expression: ast.body
      };
    }


    // ensure all parts of alternatives (=sequences) are groups.
    //   this allows to determine the character positions
    //   by cummulating the lengths of preceding groups

    RegExpTree.traverse(ast, {

      'Alternative': function(path) {
        showo(["Alternative", path.node.expressions.map(function(x) {return [x.type, x.value]})]);
        var children = [];
        var collected = [];
        var nCollected = 0;
        var nDirect = 0;
        path.node.expressions.forEach( function(child) {
          show([child.type, child.value, child.expression ? [child.expression.type, child.expression.value] : null]);
          if(
            child.type == 'Char' ||
            child.type == 'CharClass' ||
            child.type == 'Repetition' && (child.expression.type == 'Char' || child.expression.type == 'CharClass')
            ) {
            showo(["collect", child.type, child.value]);
            collected.push(child);
            nCollected++;
          } else {
            children.push(collected);
            collected = [];
            children.push(child);
            nDirect++;
          }
        });
        children.push(collected);

        if(nCollected && nDirect) {
          path.node.expressions = [];

          children.forEach(function(child) {
            if(Array.isArray(child)) {
              //showo(["child array", child.map(function(x) {return [x.type, x.value]})]);
              if(child.length > 0) {
                var groupPath = path.appendChild({
                  type: 'Group',
                  capturing: false,
                  expression: null,
                  wrapped: true
                });
                if(child.length > 1) {
                  var altPath = groupPath.setChild({
                    type: 'Alternative',
                    expressions: []
                  });
                  child.forEach(function(node) {
                    showo(["append child alt", [node.type, node.value]]);
                    altPath.appendChild(node);
                  });
                } else {
                  showo(["wrap single", child[0].type, child[0].value]);
                  groupPath.setChild(child[0]);
                }
              }
            } else {
              showo(["append child", [child.type, child.value]]);
              path.appendChild(child);
            }
          });
        }
      }
    });

    var wrapped = RegExpTree.generate(ast);
    show('--------------------- wrapped');
    show(wrapped);


    // combine adjcent wrapped groups

    if(use_combine_wrapped_groups) {

      RegExpTree.traverse(ast, {

        Group: function(path) {
          if(!path.node.wrapped)
            return;
          if(!path.node.type != "Char")
            return;
          while(true) {
            var next = path.getNextSibling();
            if( next &&
                next.node.type == 'Group' &&
                next.node.wrapped &&
                next.node.expression.type == 'Char'
              ) {
              if(path.node.expression.type != 'Alternative') {
                path.node.expression = {
                  type: 'Alternative',
                  expressions: [ path.node.expression ]
                };
              }
              path.node.expression.expressions.push(next.node.expression);
              next.remove();
            } else {
              break;
            }
          }
        }
      });

    var combined = RegExpTree.generate(ast);
    show('--------------------- combined');
    showo(combined);
    showt(ast);
    }


    RegExpTree.traverse(ast, {

      // remove useless Alternative with only one member

      Alternative: function(path) {
        if( path.node.expressions.length == 1
          ) {
          path.replace(path.node.expressions[0]);
        }
      },
      
      // remove useless Group nested in other Group

      Group: function(path) {
        if( path.node.expression.type == "Group"
          ) {
          var node = path.node;
          var child = node.expression;
          if(child.name && node.name && child.name != node.name)
            return;
          if(node.name)
            child.name = node.name;
          if(node.cpaturing)
            child.capturing = true;
          path.replace(child);
        }
      }
      
    });


    // determine names of all groups (named and numbered)
    // find hierarchy of groups (collect an array of parent group names for each named group)

    getParentNames = function(path) {
      var parentNames = [];
      while (path) {
        path = path.getParent();
        if (path) {
          if (path.node.type === 'Group') {
            if (path.node.name) {
              parentNames.push(path.node.name);
            }
          }
        }
      }
      return parentNames;
    };

    var names = [null];
    var parents = {};
    var indexCaptureGroup = 1;
    var indexNonCaptureGroup = 1;

    RegExpTree.traverse(ast, {

      Group: function(path) {
        var node = path.node;
        var non_capturing = false;
        if (!node.name) {
          if(node.capturing) {
            node.name = '' + indexCaptureGroup;
          } else {
            non_capturing = true;
            node.name = PREFIX_NON_CAPTURING + (indexCaptureGroup-1) + '.' + indexNonCaptureGroup;
            indexNonCaptureGroup++;
          }
        }
        if (node.name) {
          names.push(node.name);
          if( ! non_capturing ) {
            indexCaptureGroup++;
            indexNonCaptureGroup = 1;
          }
          parents[node.name] = getParentNames(path);
          //show([node.name, parents[node.name]]);
        }
        node.capturing = true;
        return;
      }
    });


    // remove names from all groups

    RegExpTree.traverse(ast, {
      Group: function(arg) {
        var node;
        node = arg.node;
        return delete node.name;
      }
    });

    this.names = names;
    this.parents = parents;
    //show(names);
    //show(parents);

    ast.flags = ast.flags.replace("x", "");
    var redRE = RegExpTree.generate(ast);
    this.re = RegExpTree.toRegExp(redRE);

    show('--------------------- re');
    show(this.re);
  }


  //---------------------------------------------------------------------------- exec

  RedRegExp.prototype.exec = function(text) {

    showo(text);

    var matches = this.re.exec(text);

    showo(matches);

    var result = null;
    if (!matches)
      return result;

    result = { input: text, groups: {}, names: [], infos: {} };

    var setRootGroup = function(result, name, val, info) {
      result[name] = val;
      result.infos[name] = info;
    }

    var setGroup = function(result, name, val, info) {
      if(val != null) {
        if( use_collect_group && result.groups[name] != null ) {
          if(Array.isArray(result.groups[name])) {
            result.groups[name].push(val);
            result.infos[name].push(info);
          } else {
            result.groups[name] = [result.groups[name], val];
            result.infos[name] = [result.infos[name], info];
          }
        } else {
          result.groups[name] = val;
          result.infos[name] = info;
        }
      }
      result.names.push(name);
    }

    var charIndexAll = matches.index;

    setRootGroup(result, "all",
      matches[0],
      {index: charIndexAll}
    );
    setRootGroup(result, "pre",
      matches.input.substring(0, charIndexAll),
      {index: 0}
    );
    setRootGroup(result, "post",
      matches.input.substring(charIndexAll + matches[0].length),
      {index: charIndexAll + matches[0].length}
    );

    showo(result);

    // collect result groups as strings or groups according to original expression
    var position = [];
    var groupedMin = text.length;
    var groupedMax = 0;
    var next     = [charIndexAll];
    var lastLevel = 0;
    for (var i = 1; i < this.names.length; i++) {
      var name = this.names[i];
      var val = matches[i];
      var len = val ? val.length : 0;
      var level = (this.parents[name] || []).length;
      if( ! position[level] )
        position[level] = 0;
      var pos;
      if(level > lastLevel)
        pos = position[lastLevel];
      else
        pos = next[level];
      position[level] = pos;
      if(name && name.slice(0,2) != PREFIX_NON_CAPTURING) {
        if(pos < groupedMin)
          groupedMin = pos;
        if(pos + len > groupedMax)
          groupedMax = pos + len;
        setGroup(result, name, val, {index: pos});
      }
      next[level] = pos + len;
      show(['   '.repeat(level), name, pos, next[level]]);
      lastLevel = level;
    }

    setRootGroup(result, "grouped",
      text.slice(groupedMin, groupedMax),
      {index: groupedMin}
    );

    showt(result);

    return result;
  };

  return RedRegExp;

})();
