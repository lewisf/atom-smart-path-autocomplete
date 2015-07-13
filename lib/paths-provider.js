"use babel";

import fuzzaldrin from 'fuzzaldrin';
import * as Path from 'path';
import { Point, Range } from 'atom';
import _ from 'underscore-plus';
import { handleFileExtension } from './helpers';

// (require\(['"])([a-zA-Z0-9]*)(['"]\)) <- 3 capture groups
// TODO: Look for staticroot and use the folders as regex matches.
const requireRegex = /require\(['"]{1}[a-zA-Z0-9]*/g;

export default class PathsProvider {
  constructor(redux) {
    this.selector = '.source.js, .source.jsx, .source.coffee';
    this.inclusionPriority = 1;
    this.excludeLowerPriority = true;
    this.getPaths = () => redux.getState().paths.paths;
  }

  getPrefixForCursor(editor, bufferPosition) {
    if (!editor.buffer && !bufferposition) {
      return '';
    }

    start = this.getBeginningOfCurrentWordBufferPosition(editor, bufferPosition)
    start.column = start.column + 'require("'.length;
    end = bufferPosition;
    if  (!start && !end) {
      return ''
    }
    return editor.buffer.getTextInRange(new Range(start, end))
  }

  getBeginningOfCurrentWordBufferPosition(editor, bufferPosition, allowPrevious) {
    var beginningOfWordPosition = null;
    var scanRange = new Range(new Point(bufferPosition.row, 0), bufferPosition);
    editor.buffer.backwardsScanInRange(requireRegex, scanRange, ({range, stop}) => {
      if (range.end.isGreaterThanOrEqual(bufferPosition) || !!allowPrevious) {
        beginningOfWordPosition = range.start
      } else if (beginningOfWordPosition != null && beginningOfWordPosition.isEqual(bufferPosition)) {
        stop()
      }
    })

    if (beginningOfWordPosition != null) {
      return beginningOfWordPosition;
    } else if (!!allowPrevious) {
      return [bufferPosition.row, 0]
    } else {
      return bufferPosition;
    }
  }

  getSuggestions({editor, bufferPosition, scopeDescriptor, prefix}) {
    var prefix = this.getPrefixForCursor(editor, bufferPosition);
    if (prefix && !this.gettingSuggestions && prefix.length > 3) {
      return new Promise(resolve => this.findSuggestionsForPrefix(prefix, resolve));
    }
  }

  findSuggestionsForPrefix(prefix, resolve) {
    this.gettingSuggestions = true;
    var paths = this.getPaths()
    var suggestions = _.map(paths, path => {
      return {
        displayText: path,
        text: handleFileExtension(path),
        rightLabel: Path.extname(path)
      }
    });
    suggestions = fuzzaldrin.filter(suggestions, prefix, {key: 'displayText'});
    this.gettingSuggestions = false;
    resolve(suggestions)
  }
}
