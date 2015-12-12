/**
 * Small utility module for compling HTML templates or pre-processed CSS.
 *
 * @author: [@jasonsims]('https://github.com/jasonsims')
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.render = render;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _consolidate = require('consolidate');

var _consolidate2 = _interopRequireDefault(_consolidate);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var engineMap = {
  // HTML Template engines
  'hbs': _consolidate2['default'].handlebars.render,
  'emblem': renderEmblem,
  // CSS pre-processors
  'less': renderLess,
  'stylus': renderStylus,
  'styl': renderStyl,
  'sass': renderSass,
  'scss': renderSass,
  // Handle plain CSS also
  'css': renderDefault,
  '': renderDefault
};

function render(file, locals, callback) {
  if (locals === undefined) locals = {};
  var filename = file.filename;
  var content = file.content;

  return new _bluebird2['default'](function (resolve, reject) {
    if (!content) return reject('No content in template');
    if (!filename) return reject('Filename is null');
    var engine = (0, _path.extname)(filename).slice(1);

    locals.filename = filename;
    locals.engine = '.' + engine;
    locals.templatePath = (0, _path.dirname)(filename);

    if (engine.length && _consolidate2['default'][engine] !== undefined) {
      // use consolidate.js if it supports this engine
      return _consolidate2['default'][engine].render(content, locals, function (err, rendered) {
        if (err) return reject(err);
        resolve(rendered);
      });
    } else {
      // or use the function defined in the engineMap
      var fn = engineMap[engine];
      return resolve(fn(content, locals));
    }
    return reject('Can\'t render file with extension ' + engine);
  }).nodeify(callback);
}

// Deprecated. This engine is deprecated since v2.0
function renderEmblem(source, locals) {
  var emblem = require('emblem');
  var handlebars = require('handlebars');
  console.warn('Please migrate your templates to other engine. Email Templates will stop supporting emblem on the next version');

  var template = emblem.compile(handlebars, source);
  return _bluebird2['default'].resolve(template(locals));
}

// CSS pre-processors
function renderLess(source, locals) {
  var less = require('less');
  var dir = (0, _path.dirname)(locals.filename);
  var base = (0, _path.basename)(locals.filename);

  return new _bluebird2['default'](function (done, reject) {
    less.render(source, {
      paths: [dir],
      filename: base
    }, function (err, output) {
      if (err) return reject(err);
      done(output.css || output);
    });
  });
}

function renderStylus(source, locals) {
  var stylus = require('stylus');

  // Render stylus synchronously as it does not appear to handle asynchronous
  // calls properly when an error is generated.
  var css = stylus.render(source, locals);
  return _bluebird2['default'].resolve(css);
}

function renderStyl(source, locals) {
  var styl = require('styl');

  var css = styl(source, locals).toString();
  return _bluebird2['default'].resolve(css);
}

function renderSass(source, locals) {
  var sass = require('node-sass');

  locals.data = source;
  locals.includePaths = [locals.templatePath];

  return new _bluebird2['default'](function (done, reject) {
    sass.render(locals, function (err, data) {
      if (err) return reject(err);
      done(data.css.toString());
    });
  });
}
// Default wrapper for handling standard CSS and empty source.
function renderDefault(source) {
  return _bluebird2['default'].resolve(source);
}