"use babel";

/* eslint-disable quotes */
/* globals atom */

import * as _ from 'lodash';
import {
  PATHS_LOADED,
  START_PATHS_LOAD,
  TERMINATE_PATHS_LOAD
} from '../constants/Actions';
import * as path from 'path';

const config = atom.config.get('atom-smart-path-autocomplete');

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
    var projectRoot = atom.project.getPaths()[0];
    let processedPaths = paths;

    // Use git ignore
    var repo = null;
    if (config.useGitIgnore) {
      let repos = atom.project.getRepositories();
      repo = repos.length ? repos : null;
      if (repo) {
        processedPaths = processedPaths.filter(filepath => {
          let relativePath = path.relative(projectRoot, filepath);
          return !repo.isPathIgnored(relativePath);
        });
      }
    }

    // TODO: Implement filtering based on a whitelist of file extensions.

    processedPaths = processedPaths.map(filepath => filepath.replace(projectRoot + '/', ''));

    if (config.staticRoot) {
      processedPaths = processedPaths.map(filepath => filepath.replace(config.staticRoot, ''));
    }

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
