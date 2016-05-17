"use babel";

/* globals atom */

import path from 'path';
import _ from 'underscore-plus';

/**
 * TODO: Genericize this into options that are configurable
 */

var transformFileExtensions = [
  {
    ext: 'styl',
    replace: 'css',
    'prefix': 'css!'
  }, {
    ext: 'js',
    trim: true
  }, {
    ext: 'jsx',
    trim: true
  }
];

exports.handleFileExtension = function(_path) {
  var ext = path.extname(_path);
  var transform = _.find(transformFileExtensions, (t) => ('.' + t.ext) === ext);
  var res = _path;
  if (transform) {
    if (transform.trim) {
      res = res.substring(0, res.lastIndexOf(ext));
    }
    if (transform.replace) {
      res = res.replace(ext, ('.' + transform.replace));
    }
    if (transform.prefix) {
      res = transform.prefix + res;
    }
  }

  return res;
};
