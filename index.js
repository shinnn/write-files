'use strict';

const eachAsync = require('each-async');
const assertFsReadfileOption = require('assert-fs-readfile-option');
const isPlainObj = require('is-plain-obj');
const rimraf = require('rimraf');
const writeFileAtomic = require('write-file-atomic');

module.exports = function writeFiles(nameDataMap, options, cb) {
  if (cb === undefined) {
    cb = options;
    options = {};
  } else {
    assertFsReadfileOption(options);
  }

  if (!isPlainObj(nameDataMap)) {
    throw new TypeError(
      nameDataMap +
      ' is not a plain object. Expected an object that includes filename-data map.'
    );
  }

  if (typeof cb !== 'function') {
    throw new TypeError(
      cb +
      ' is not a function. The last argument to write-files must be a callback function.'
    );
  }

  let firstError = null;
  const createdFilePaths = [];

  eachAsync(Object.keys(nameDataMap), function writeFileIterator(filePath, index, done) {
    writeFileAtomic(filePath, nameDataMap[filePath], options, err => {
      if (err) {
        if (firstError === null) {
          firstError = err;
        }
      } else {
        createdFilePaths.push(filePath);
      }

      done();
    });
  }, function writeFilesCallback() {
    if (firstError) {
      let rmGlobPattern;
      if (createdFilePaths.length === 1) {
        rmGlobPattern = createdFilePaths[0];
      } else {
        rmGlobPattern = `{${createdFilePaths.join(',')}}`;
      }

      rimraf(rmGlobPattern, () => cb(firstError));
      return;
    }

    cb(firstError);
  });
};
