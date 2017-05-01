# UXRegExp - uxregexp

**u**seful e**x**tended **reg**ular **exp**ressions

*   [![npm-version](https://img.shields.io/npm/v/uxregexp.svg)]() [![build](https://travis-ci.org/hg42/uxregexp.svg?branch=master)]()
*   [![npm-version@next](https://img.shields.io/npm/v/uxregexp/next.svg)]() [![build](https://travis-ci.org/hg42/uxregexp.svg?branch=next)]()
*   [![issues](https://img.shields.io/github/issues/hg42/uxregexp.svg)]() [![pull-requests](https://img.shields.io/github/issues-pr/hg42/uxregexp.svg)]()
*   [![code-coverage](https://img.shields.io/codecov/c/github/hg42/uxregexp/master.svg)](https://codecov.io/github/hg42/uxregexp?branch=master)
*   [![dependencies](https://david-dm.org/hg42/uxregexp/status.svg)](https://david-dm.org/hg42/uxregexp) [![devDependency Status](https://david-dm.org/hg42/uxregexp/dev-status.svg)](https://david-dm.org/hg42/uxregexp#info=devDependencies)
*   [![npm-downloads](https://img.shields.io/npm/dt/uxregexp.svg)]() [![npm](https://img.shields.io/npm/dm/uxregexp.svg)]() [![npm](https://img.shields.io/npm/dw/uxregexp.svg)]()
*   [![license](https://img.shields.io/npm/l/uxregexp.svg)]()

## purpose

A regular expression module with a redefined API to

*   add some extended features
*   make regular expressions more usable

## features

**"stable"** features in the sense of "API unlikely to change":
*   **named groups**: `(?<name>...)` -> `matches.groups.name` or `matches.groups['name']`
*   **numbered groups** are handled like named groups (number used as name): `matches.groups[1]`
*   **char index for each group** (position in input string): `matches.infos[name].index`
*   matches.**all** returns match for the whole expression (`matches[0]` in javascript)
*   matches.**pre**, matches.**post**
*   support for **x-flag**: (whitespace/newlines/comments ignored)

Some features are not listed here, because they will probably change in the future.
Please have look at the last section of this document for some **unstable features**.

## disclaimer

It does **NOT** try to be **compatible** to javascript RegExp.
Instead it tries to create a more useful API.

It's currently only used for a single use-case (a contribution to an Atom add-on `process-palette`),
so
*   it will probably go through some more development steps
*   the API may change
*   I am open for suggestions
*   it is not tested in the wild
*   I still expect to find bugs
*   it is not mature for production use (= use it at your own risk)

## example
```js
UXRegExp = require('uxregexp');
var matches = new UXRegExp('/a(b)(?:c)(d)(?<E>e)f/')
                     .exec('PREabcdefPOST');
console.log(matches);
// ->
{ input: 'PREabcdefPOST',
  //      0123456789012
  groups: { '1': 'b', '2': 'd', E: 'e' },
  names: [ 1, 2, 'E' ],
  infos:
   { '1': { index: 4 },
     '2': { index: 6 },
     all: { index: 3 },
     pre: { index: 0 },
     post: { index: 9 },
     E: { index: 7 },
     grouped: { index: 4 } },
  all: 'abcdef',
  pre: 'PRE',
  post: 'POST',
  grouped: 'bcde' }
```

## distribution

There is a `@next` channel (see `npm dist-tag`), where an upcoming version may be published for testing by beta testers or developers
*   this can be an older version than `@latest`
*   use `npm install uxregexp@next`
*   use `npm install uxregexp` instead to install from the default channel `@latest`

## basic algorithm

The extended regexp syntax is preprocessed and then **parsed** by `regexp-tree` (a nice module owned by github/DmitrySoshnikov) into an abstract syntax tree (AST).
The tree is then transformed in several ways to extract names and indexes etc.
Then a javascript regexp is generated from the AST and stored in the object.

The exec method executes the javascript regexp and postprocesses the result with the collected information from pass one into a result object.


## why?

There are many modules for extended regular expressions, so why another one?

From my point of view, the **javascript RegExp** class has a **design flaw**,
which makes them nearly unusable in some use-cases.

Example:
```js
var matches = /a(b)(c)d/.exec('abcd');
console.log(matches);
// ->
[ 'abcd', 'b', 'c', index: 0, input: 'abcd' ]
```

Javascript RegExp API returns
*   the whole matched string (`matches[0]`)
*   a string for each capturing group (`matches[1], ...`)
*   the position of the first matching character (`matches.index`)
*   the input string (`matches.input`)
*   nothing more...

Most (or may be all?) other regexp libraries like perl, PCRE, python, golang, ... return character indexes for each group.
But javascript does not provide these. You ony get the start index of the whole match.

You can try this online at [regex101](https://regex101.com/)

You may use `/a(b)(c)d/` as expression and `'abcd'` as test string.
If you switch between regexp engines (_flavor_ on the left), you will see something like
`"Group 1. n/a b"` for javascript (index not available) and
`"Group 1. 1-2 b"` for all other engines.

There are several use-cases where we want to split a string into pieces and we need the character positions of the groups for that.

As a workaround some people suggest to search the group result string in the whole match. E.g.
```js
var matches = /a(b)(c)d/.exec('abcd');
var index_b = matches.index + matches[0].indexOf(matches[1]);
var index_c = matches.index + matches[0].indexOf(matches[2]);
console.log([index_b, index_c]);
// ->
[1, 2]
```
This is the correct result for this case, but the strategy is wrong in the general case, because the group string can exist multiple times and you would always find the first.

E.g. if `/a(b)(b)c/` would be applied to `'abbc'`,
you would find the first `b` for both groups (`index = 1` for both),
which is wrong:
```js
var matches = /a(b)(b)c/.exec('abbc');
var index_b1 = matches.index + matches[0].indexOf(matches[1]);
var index_b2 = matches.index + matches[0].indexOf(matches[2]);
console.log([index_b1, index_b2]);
// ->
[1, 1]
```


You can solve this by ensuring all subexpressions in front of groups are wrapped in groups and cumulating the lengths of all these preceding strings:
```js
var matches = /(a)(b)(b)c/.exec('abbc');
var index_b1 = matches.index + matches[1].length;
                // start of match + length of 'a'
var index_b2 = matches.index + matches[1].length
                             + matches[2].length;
                // start of match + length of 'a'
                //                + length of first 'b'
console.log([index_b1, index_b2]);
// ->
[1, 2]
```
This works, but for complex expressions it's complicated and a lot of work.
In my use-case, a user creates the regular expression himself, so I definitely don't want to bother him with this increased complexity.

There are several npm modules that precompile an extended version of regexp to the native javascript RegExp. Those usually add features like named groups, etc.
I added some of those extended features to the module to make it more usable.

## unstable features

These are generally working, but they may change or even be removed in future.
Discussion is welcome:
*   matches.**grouped** returns the hull of all capturing groups, while matches.all also includes non-captured strings
    => QUESTION: does `grouped` describe what it does?
    ```js
    UXRegExp = require('uxregexp');
    var matches = new UXRegExp('/a(b)(?:c)(d)(?:e)f/')
                         .exec('PREabcdefPOST');
    console.log([matches.all, matches.grouped]);
    // ->
    ['abcd', 'bcd']
    ```

## todo

see todo.txt
