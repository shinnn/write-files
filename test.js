'use strict';

const assert = require('assert');

const globPromise = require('glob-promise');
const readFile = require('fs-readfile-promise');
const readMultipleFiles = require('read-files-promise');
const rimraf = require('rimraf');
const test = require('tape');
const writeFiles = require('.');

test('writeFiles()', t => {
  t.plan(15);

  t.strictEqual(writeFiles.name, 'writeFiles', 'should have a function name.');

  writeFiles({tmp: 1}, err => {
    t.strictEqual(err, null, 'should create a single file without any errors.');
    readFile('tmp', 'utf8').then(content => {
      t.strictEqual(content, '1', 'should write data to the file.');
    }).catch(t.fail);
  });

  writeFiles({a: null, b: 'foo'}, null, err => {
    t.strictEqual(err, null, 'should create multiple files without any errors.');
    readMultipleFiles(['a', 'b'], 'utf8').then(contents => {
      t.deepEqual(['null', 'foo'], contents, 'should write different data to each files.');
    }).catch(t.fail);
  });

  writeFiles({}, {encoding: 'ucs2'}, err => {
    t.strictEqual(err, null, 'should accept an empty object as its second argument.');
  });

  writeFiles({c: 'cc', d: 'dd'}, 'base64', err => {
    t.strictEqual(err, null, 'should accept a string as its second argument.');
    readMultipleFiles(['c', 'd'], 'base64').then(contents => {
      t.deepEqual(
        contents,
        ['cc', 'dd'].map(str => new Buffer(str, 'base64').toString('base64')),
        'should reflect encoding to the created file.'
      );
    }).catch(t.fail);
  });

  writeFiles({'node_modules/write-file-atomic': new Buffer('_'), e: 'e'}, err => {
    t.ok(
      /(EISDIR|EPERM).*node_modules.*write-file-atomic/.test(err),
      'should pass an error to its callback when it fails to create a file.'
    );
    globPromise('e').then(paths => {
      t.strictEqual(paths.length, 0, 'should unlink all files listed after the failed file.');
    }).catch(t.fail);
  });

  writeFiles({f: 'f', g: 'g', '/': '_', 'node_modules/write-file-atomic': '_'}, err => {
    t.notOk(
      /node_modules/.test(err),
      'should pass only the first error to its callback when more than one errors occurs.'
    );
    globPromise('{f,g}').then(paths => {
      t.strictEqual(paths.length, 0, 'should unlink all files listed before the failed file.');
    }).catch(t.fail);
  });

  t.throws(
    () => writeFiles(['a', 'b'], t.fail),
    /TypeError.* is not a plain object/,
    'should throw a type error when the first argument is not a plain object.'
  );

  t.throws(
    () => writeFiles({a: ''}, 'THIS_IS_STRING'),
    /TypeError.* is not a function. The last argument to write-files must be a callback function/,
    'should throw a type error when the last argument is not a function.'
  );

  t.throws(
    () => writeFiles({f: 'bar'}, {encoding: 'utf7'}, t.fail),
    /Unknown encoding: utf7/,
    'should throw an error when it takes invalid options.'
  );

  t.on('end', () => rimraf('{tmp,a,b,c,d,e}', assert.ifError));
});
