# write-files

[![NPM version](https://img.shields.io/npm/v/write-files.svg)](https://www.npmjs.com/package/write-files)
[![Build Status](https://travis-ci.org/shinnn/write-files.svg?branch=master)](https://travis-ci.org/shinnn/write-files)
[![Build status](https://ci.appveyor.com/api/projects/status/7y66x4gyplx2pbsd?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/write-files)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/write-files.svg)](https://coveralls.io/github/shinnn/write-files?branch=master)
[![Dependency Status](https://img.shields.io/david/shinnn/write-files.svg?label=deps)](https://david-dm.org/shinnn/write-files)
[![devDependency Status](https://img.shields.io/david/dev/shinnn/write-files.svg?label=devDeps)](https://david-dm.org/shinnn/write-files#info=devDependencies)

Write multiple files parallelly

```javascript
const writeFiles = require('write-files');

writeFiles({
  'foo.txt': 'foo',
  'bar.txt': 'bar'
}, err => {
  if (err) {
    throw err;
  }

  fs.readFileSync('foo.txt', 'utf8'); //=> 'foo'
  fs.readFileSync('bar.txt', 'utf8'); //=> 'bar'
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install write-files
```

## API

```javascript
const writeFiles = require('write-files');
```

### writeFiles(*nameDataMap* [, *options*], *callback*)

*nameDataMap*: `Object` (`{"filename0": "contents0", "filename1": "contents1", ... }`)  
*options*: `Object` or `String` (directly passed to [`write-file-atomic`](https://github.com/iarna/write-file-atomic))  
*callback*: `Function`

The API is quite the same as [write-file-atomic's](https://github.com/iarna/write-file-atomic#var-writefileatomic--requirewrite-file-atomicwritefileatomicfilename-data-options-callback). The only difference is *write-files* requires an `Object` as its first argument: Each key of the object will be used as a file path, and each value of the object will be written to a path where the corresponding key indicates.

After one or more file output failed, it passes an error to its callback function and removes already created files.

```javascript
const glob = require('glob');
const writeFiles = require('write-files');

writeFiles({
  file1: '1', // success
  file2: '2', // success
  file3: '3', // fail
  file4: '4'  // success
}, err => {
  !!err; //=> true

  glob('file{1,2,3,4}' err, () => {
    paths.length; //=> 0
  });
});
```

## License

Copyright (c) 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
