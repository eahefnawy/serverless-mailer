'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.ensureDirectory = ensureDirectory;
exports.readContents = readContents;
exports.renderFile = renderFile;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _templateManager = require('./template-manager');

var readFileP = _bluebird2['default'].promisify(_fs.readFile);
var globP = _bluebird2['default'].promisify(_glob2['default']);

function ensureDirectory(path, callback) {
  return new _bluebird2['default'](function (resolve, reject) {
    (0, _fs.stat)(path, function (err, stat) {
      if (err) return reject(err);
      if (!stat.isDirectory()) return reject();
      resolve();
    });
  }).nodeify(callback);
}

function readContents(path, type) {
  return globP(path + '/*' + type + '.*').then(function (files) {
    if (!files.length) return null;

    return readFileP(files[0], 'utf8').then(function (content) {
      if (!content.length) return null;
      return {
        filename: files[0],
        content: content
      };
    });
  });
}

function renderFile(file, options) {
  if (!file) return Promise.resolve(null);
  return (0, _templateManager.render)(file, options);
}