
var RegExpTree = require('regexp-tree');
var PREFIX_NON_CAPTURING = '$$';

module.exports =
UXRegExp = (function() {

  var use_collect_groups_with_same_name = 1;

  // var debug = 0;
  //
  // var show = function(x) {
  //   console.log(x);
  // };
  //
  // var showt = function(x) {
  //   show(JSON.stringify(x, null, '  '));
  // };
  //
  // var showo = function(x) {
  //   show(JSON.stringify(x));
  // };

  //---------------------------------------------------------------------------- constructor

  function UXRegExp(re, options) {

    //if (debug >= 1) showo(['input expression', re, options]);

    var flags = '';
    var rtOptions = {};

    if(typeof options === 'string') {
      flags += options;
    } else if(typeof options === 'object') {
      if(options.flags) {
        flags += options.flags;
        delete options.flags;
      }
    }

    if(typeof re !== 'string') {
      re = re.toString();
    }

    // extract flags, set options and remove those not known by javascript

    var matches = /^\s*\/([\s\S]*)\/([a-z]*)\s*$/.exec(re);
    if (matches) {
      re = matches[1];
      flags += matches[2];
    }
    // escape '/'
    re = re.replace('/', '\\/');
    re = re.replace('\\\\/', '\\/');

    // automatically use x-flag for regexp with newlines

    if (re.includes('\n')) {
      flags += 'x';
    }

    // santize flags (sort, uniq)

    flags = flags.split('')
                 .sort()
                 .filter(
                   function(e,i,a) {
                     return !i || e != a[i-1];
                   }
                 )
                 .join('');

    re = '/' + re + '/' + flags;

    //showo(['after preprocess', re]);


    // build AST from re

    var ast = RegExpTree.parser.parse(re, rtOptions);

    //if(debug >= 3) showt(ast);


    // check if any named or capturing groups exist...
    //
    // var anyNamedOrCapturingGroup = 0;
    // RegExpTree.traverse(ast, {
    //
    //   Group: function(path) {
    //     var node = path.node;
    //     //if (node.name || node.capturing) {
    //     if (node.capturing) {
    //       return anyNamedOrCapturingGroup++;
    //     }
    //   }
    // });
    // //showo(['anyNamedOrCapturingGroup', anyNamedOrCapturingGroup]);
    //
    //
    // // ...otherwise wrap whole expression in a group
    //
    // if (!anyNamedOrCapturingGroup) {
    //   ast.body = {
    //     type: 'Group',
    //     capturing: false,
    //     expression: ast.body
    //   };
    // }


    // ensure all parts of alternatives (=sequences) are groups.
    //   this allows to determine the character positions
    //   by cummulating the lengths of preceding groups

    // these must be wrapped
    var toBeWrapped = function(node) {
      var result = ! (node.type === 'Group');
      //showo(['toBeWrapped', result, node.type, node.expression ? node.expression.type : node.value]);
      return result;
    }

    // these can be combined when wrapped
    var toBeCombined = function(node) {
      var result = toBeWrapped(node)
                      && ! (
                        node.type === 'Repetition'
                          && node.expression.type === 'Group'
                          && node.expression.capturing
                      );
      //showo(['toBeCombined', result, node.type, node.expression ? node.expression.type : node.value]);
      return result;
    }
    //var toBeCombined = toBeWrapped;
    //var toBeCombined = function(node) { return false; };

    // var unwrapped = RegExpTree.generate(ast);
    // if(debug >= 2) show('--------------------- unwrapped');
    // if(debug >= 2) show(unwrapped);

    RegExpTree.traverse(ast, {

      'Alternative': function(path) {

        // ignore if this was created by collecting wrapped nodes
        if(path.node.combined)
          return;

        //showo(['Alternative', path.node.expressions.map(function(x) {return [x.type, x.value]})]);
        var children = [];
        var collected = [];
        var nCollected = 0;
        var nDirect = 0;
        path.node.expressions.forEach( function(child) {
          //show([child.type, child.value, child.expression ? [child.expression.type, child.expression.value] : null]);
          if(toBeCombined(child)) {
            //showo(['collect', child.type, child.value]);
            collected.push(child);  // collect
            nCollected++;
          } else if(toBeWrapped(child)) {
            //showo(['wrap   ', child.type, child.value]);
            if(collected.length) children.push(collected);
            collected = [];
            children.push([child]); // single array item -> wrap!
            nCollected++;
          } else {
            //showo(['copy   ', child.type, child.value]);
            if(collected.length) children.push(collected);
            collected = [];
            children.push(child);   // no wrap
            nDirect++;
          }
        });
        // TODO: wrapping not really necessary after the last capturing group
        // to push all remaining objects without wrapping
        //Array.prototype.push.apply(children, collected);
        if(collected.length) children.push(collected);

        //showo([nCollected, nDirect]);
        if(1 || nCollected && nDirect) { // TODO: optimize groups in groups

          // clear all expressions
          path.node.expressions = [];

          children.forEach(function(child) {
            if(Array.isArray(child)) {
              // collected nodes have to be wrapped in group
              //showo(['child array', child.map(function(x) {return [x.type, x.value]})]);
              // add Group
              var groupPath = path.appendChild({
                type: 'Group',
                capturing: false,
                expression: null,
                wrapped: true
              });
              if(child.length > 1) {
                // add array of collected nodes to group
                var altPath = groupPath.setChild({
                  type: 'Alternative',
                  expressions: [],
                  combined: true
                });
                child.forEach(function(node) {
                  //showo(['append child alt', [node.type, node.value]]);
                  altPath.appendChild(node);
                });
              } else {
                // add single collected node to group
                //showo(['wrap single', child[0].type, child[0].value]);
                groupPath.setChild(child[0]);
              }
            } else {
              // add the node without wrapping
              //showo(['append child', [child.type, child.value]]);
              path.appendChild(child);
            }
          });
        }
      }
    });

    // var wrapped = RegExpTree.generate(ast);
    // if(debug >= 1) show('--------------------- wrapped');
    // if(debug >= 1) show(wrapped);


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
            node.name = indexCaptureGroup;
          } else {
            non_capturing = true;
            node.name = - (10000*(indexCaptureGroup-1) + indexNonCaptureGroup);
            indexNonCaptureGroup++;
          }
        }
        if (node.name) {
          names.push(node.name);
          if( ! non_capturing ) {
            indexCaptureGroup++;
            //indexNonCaptureGroup = 1;
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
    //if(debug >= 3) show(names);
    //if(debug >= 3) show(parents);

    ast.flags = ast.flags.replace('x', '');
    var xre = RegExpTree.generate(ast);
    this.re = RegExpTree.toRegExp(xre);

    //showt(this);

    // if(debug >= 1) show('--------------------- re');
    // if(debug >= 1) show(this.re);
  }


  //---------------------------------------------------------------------------- exec

  UXRegExp.prototype.exec = function(text) {

    //if (debug >= 1) showo(text);

    var matches = this.re.exec(text);

    //if (debug >= 1) showo(matches);

    if (!matches)
      return null;

    var result = { input: text, groups: {}, names: [], infos: {} };

    var setRootGroup = function(result, name, val, info) {
      result[name] = val;
      result.infos[name] = info;
    }

    var setGroup = function(result, name, val, info) {
      if(val != null) {
        if( use_collect_groups_with_same_name && result.groups[name] != null ) {
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

    setRootGroup(result, 'all',
      matches[0],
      {index: charIndexAll}
    );
    setRootGroup(result, 'pre',
      matches.input.substring(0, charIndexAll),
      {index: 0}
    );
    setRootGroup(result, 'post',
      matches.input.substring(charIndexAll + matches[0].length),
      {index: charIndexAll + matches[0].length}
    );

    //if (debug >= 3) showo(result);

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
      if(name && ! (typeof name === "number" && name < 0)) {
        if(pos < groupedMin)
          groupedMin = pos;
        if(pos + len > groupedMax)
          groupedMax = pos + len;
        setGroup(result, name, val, {index: pos});
      }
      next[level] = pos + len;
      //if (debug >= 2) show(['   '.repeat(level), name, pos, next[level]]);
      lastLevel = level;
    }

    setRootGroup(result, 'grouped',
      text.slice(groupedMin, groupedMax),
      {index: groupedMin}
    );

    //if (debug >= 1) showt(result);

    return result;
  };

  return UXRegExp;

})();
