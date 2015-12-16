"use babel";
/*eslint-disable no-unused-vars*/

import Promise from 'bluebird';
Promise.longStackTraces();
import fuzzaldrin from 'fuzzaldrin';
import * as Path from 'path';
import { Point, Range } from 'atom';
import _ from 'underscore-plus';
import { handleFileExtension } from './helpers';

/**
 * Regular expression matches the path contents of eg.
 *   var x = require('MATCHEDPATH');
 * or
 *   import x from 'MATCHEDPATH'
 */
// const regex = /require\(['"]{1}([a-zA-Z0-9]*)|from\s['"]{1}([a-zA-Z0-9]*)/g;
const requireRegex = /require\(['"]{1}([a-zA-Z0-9]*)/g;

export default class AutocompletePathProvider {

  constructor(redux) {
    this.selector = '.source.js, .source.jsx';
    this.inclusionPriority = 1;
    this.excludeLowerPriority = false;
    this.redux = redux;
  }

  getPaths() {
    var array = [];
    for (var [key, value] of this.redux.getState().paths.paths) {
      array.push(key);
    }
    return array;
  }

  getSuggestions({editor, bufferPosition, scopeDescriptor}) {
    let prefix = this.getPrefix(editor, bufferPosition);
    if (prefix && !this.gettingSuggestions && prefix.length > 3) {
      return new Promise(resolve => this.findSuggestionsForPrefix(prefix, resolve));
    }
  }

  findSuggestionsForPrefix(prefix, resolve) {
    this.gettingSuggestions = true;
    var paths = this.getPaths();
    var suggestions = paths.map(path => {
      return {
        displayText: path,
        text: handleFileExtension(path),
        rightLabel: Path.extname(path)
      };
    });
    suggestions = fuzzaldrin.filter(suggestions, prefix, {key: 'displayText'});
    this.gettingSuggestions = false;
    resolve(suggestions);
  }

  getPrefix(editor, bufferPosition) {
    if (!editor.buffer && !bufferPosition) {
      return '';
    }

    var start = this.getBeginningOfCurrentWordBufferPosition(editor, bufferPosition, false);
    var end = bufferPosition;
    if (!start && !end) {
      return '';
    }
    return editor.getTextInRange(new Range(start, end));
  }

  getBeginningOfCurrentWordBufferPosition(editor, bufferPosition, allowPrevious) {
    var beginningOfWordPosition = null;
    var scanRange = new Range(new Point(bufferPosition.row, 0), bufferPosition);
    editor.buffer.backwardsScanInRange(requireRegex, scanRange, ({range, stop}) => {
      if (range.end.isGreaterThanOrEqual(bufferPosition) || !!allowPrevious) {
        range.start.column = range.start.column + 'require("'.length;
        beginningOfWordPosition = range.start;
      } else if (beginningOfWordPosition !== null && beginningOfWordPosition.isEqual(bufferPosition)) {
        stop();
      }
    });

    if (beginningOfWordPosition !== null) {
      return beginningOfWordPosition;
    } else if (allowPrevious) {
      return [bufferPosition.row, 0];
    } else {
      return bufferPosition;
    }
  }

  onDidInsertSuggestion({editor, triggerPosition, suggestion}) {
    window.editor = editor;
    editor.moveToEndOfLine();
  }
}
