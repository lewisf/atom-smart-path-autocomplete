"use babel";

import path from 'path';
import _ from 'underscore-plus';

var transformFileExtensions = atom.config.get('autocomplete-require-paths').transformFileExtensions;

exports.handleFileExtension = function(_path) {
  var ext = path.extname(_path);
  var transform = _.find(transformFileExtensions, function(t) { return ('.' + t.ext) === ext});
  var res = _path;
  if (transform) {
    if (transform.trim) {
      res = res.substring(0, res.lastIndexOf(ext));
    }
    if (transform.replace) {
      res = res.replace(ext, ('.' + transform.replace))
    }
    if (transform.prefix) {
      res = transform.prefix + res;
    }
  }

  return res;
}
