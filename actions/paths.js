"use babel";

/* eslint-disable quotes */
/* globals atom */

import * as _ from 'lodash';
import {
  PATHS_LOADED,
  START_PATHS_LOAD,
  TERMINATE_PATHS_LOAD
} from '../constants/Actions';

// use require since can't use es6 module syntax.
var PathLoader = require(atom.packages.resolvePackagePath('fuzzy-finder') + '/lib/path-loader');

function loadedPaths(paths) {
  return {
    type: PATHS_LOADED,
    result: paths
  };
}

function pathLoadTask(dispatch) {
  return PathLoader.startTask((paths) => {
    var projectRoot = atom.project.getPaths();
    const config = atom.config.get('atom-smart-path-autocomplete');
    // Only get paths that are part of projectRoot and remove it
    let processedPaths = _.chain(paths)
      // .filter(path => path.indexOf(projectRoot) > -1)
      .filter(path => {
        return !_.chain(config.ignoredDirsAndFiles)
          .find((dirOrFile) => path.indexOf(`${dirOrFile}`) > -1)
          .some()
          .value();
      })
      .map(path => path.replace(projectRoot, ''))
      .map(path => {
        var tempPath = path;
        _.each(config.pathReplacements, function(replacement) {
          var temp = replacement.split('|');
          tempPath = tempPath.replace(temp[0], temp[1]);
        });
        return tempPath;
      })
      .value();

    return dispatch(loadedPaths(processedPaths));
  });
}

export function startLoadPaths() {
  return dispatch => {
    var task = setTimeout(() => pathLoadTask(dispatch), 1000);

    dispatch({
      type: START_PATHS_LOAD,
      task: task
    });
  };
}

export function terminateLoadPaths() {
  return {
    type: TERMINATE_PATHS_LOAD
  };
}
