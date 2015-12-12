'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _util = require('./util');

var _lodash = require('lodash');

var _emailTemplate = require('./email-template');

var _emailTemplate2 = _interopRequireDefault(_emailTemplate);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _path = require('path');

var _consolidate = require('consolidate');

var debug = (0, _debug2['default'])('email-templates:creator');

function exportable(templateDirectory, options, done) {
  if ((0, _lodash.isFunction)(options)) {
    done = options;
    options = {};
  }
  if (!templateDirectory) {
    return done(new Error('templateDirectory is undefined'));
  }

  return (0, _util.ensureDirectory)(templateDirectory, function (err) {
    if (err) return done(err);
    debug('Creating Email Templates in %s', (0, _path.basename)(templateDirectory));
    return done(null, template(templateDirectory, options));
  });
}

function template(templateDirectory, options) {
  return function _template(directory, locals, callback) {
    if ((0, _lodash.isFunction)(locals)) {
      callback = locals;
      locals = {};
    }
    if (directory == null) {
      return callback(new Error('templateName was not defined'));
    }

    var et = new _emailTemplate2['default'](templateDirectory + '/' + directory, options);
    if (locals === true) {
      return callback(null, function (locals, dir, next) {
        et.render(locals, function (err, result) {
          result = result || {};
          next(err, result.html, result.text);
        });
      });
    }

    et.render(locals, function (err, result) {
      result = result || {};
      callback(err, result.html, result.text);
    });
  };
}

exportable.EmailTemplate = _emailTemplate2['default'];
exportable.requires = _consolidate.requires;

exports['default'] = exportable;
module.exports = exports['default'];