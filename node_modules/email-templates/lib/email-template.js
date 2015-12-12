'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _path = require('path');

var _juice = require('juice');

var _juice2 = _interopRequireDefault(_juice);

var _lodash = require('lodash');

var _util = require('./util');

var debug = (0, _debug2['default'])('email-templates:email-template');

var EmailTemplate = (function () {
  function EmailTemplate(path) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, EmailTemplate);

    this.files = {};
    this.path = path;
    this.dirname = (0, _path.basename)(path);
    this.options = options;
    debug('Creating Email template for path %s', (0, _path.basename)(path));
  }

  _createClass(EmailTemplate, [{
    key: '_init',
    value: function _init() {
      var _this = this;

      if (this.isInited) return _bluebird2['default'].resolve();

      debug('Initializing templates');
      return (0, _util.ensureDirectory)(this.path).then(function () {
        return _this._loadTemplates();
      }).then(function () {
        _this.isInited = true;
        debug('Finished initializing templates');
      });
    }
  }, {
    key: '_loadTemplates',
    value: function _loadTemplates() {
      var _this2 = this;

      return _bluebird2['default'].map(['html', 'text', 'style'], function (type) {
        return (0, _util.readContents)(_this2.path, type);
      }).then(function (files) {
        var _files = _slicedToArray(files, 3);

        var html = _files[0];
        var text = _files[1];
        var style = _files[2];

        if (!html && !text) {
          var err = new Error('Neither html nor text template files found or are both empty in path ' + _this2.dirname);
          err.code = 'ENOENT';
          throw err;
        }

        if (html) {
          debug('Found HTML file %s in %s', (0, _path.basename)(html.filename), _this2.dirname);
        }
        _this2.files.html = html;

        if (text) {
          debug('Found text %s file in %s', (0, _path.basename)(text.filename), _this2.dirname);
        }
        _this2.files.text = text;

        if (style) {
          debug('Found stylesheet %s in %s', (0, _path.basename)(style.filename), _this2.dirname);
        }
        _this2.files.style = style;

        debug('Finished loading template');
      });
    }
  }, {
    key: 'renderText',
    value: function renderText(locals, callback) {
      var _this3 = this;

      debug('Rendering text');
      return this._init().then(function () {
        if (!_this3.files.text) return null;
        return (0, _util.renderFile)(_this3.files.text, locals);
      }).tap(function () {
        return debug('Finished rendering text');
      }).nodeify(callback);
    }
  }, {
    key: 'renderHtml',
    value: function renderHtml(locals, callback) {
      var _this4 = this;

      debug('Rendering HTML');
      return this._init().then(function () {
        return _bluebird2['default'].all([(0, _util.renderFile)(_this4.files.html, locals), _this4._renderStyle(locals)]);
      }).then(function (results) {
        var _results = _slicedToArray(results, 2);

        var html = _results[0];
        var style = _results[1];

        if (!style) return html;
        if (_this4.options.juiceOptions) {
          debug('Using juice options ', _this4.options.juiceOptions);
        }
        return _juice2['default'].inlineContent(html, style, _this4.options.juiceOptions || {});
      }).tap(function () {
        return debug('Finished rendering HTML');
      }).nodeify(callback);
    }
  }, {
    key: 'render',
    value: function render(locals, callback) {
      if ((0, _lodash.isFunction)(locals)) {
        callback = locals;
        locals = {};
      }
      debug('Rendering template with locals %j', locals);

      return _bluebird2['default'].all([this.renderHtml(locals), this.renderText(locals)]).then(function (rendered) {
        var _rendered = _slicedToArray(rendered, 2);

        var html = _rendered[0];
        var text = _rendered[1];

        return {
          html: html, text: text
        };
      }).nodeify(callback);
    }
  }, {
    key: '_renderStyle',
    value: function _renderStyle(locals) {
      var _this5 = this;

      return new _bluebird2['default'](function (resolve) {
        // cached
        if (_this5.style !== undefined) return resolve(_this5.style);

        // no style
        if (!_this5.files.style) return resolve(null);

        debug('Rendering stylesheet');
        (0, _util.renderFile)(_this5.files.style, locals).then(function (style) {
          _this5.style = style;
          debug('Finished rendering stylesheet');
          resolve(style);
        });
      });
    }
  }]);

  return EmailTemplate;
})();

exports['default'] = EmailTemplate;
module.exports = exports['default'];