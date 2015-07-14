"use babel";

/* eslint-disable no-reserved-keys */
/* globals atom */

import { createRedux } from 'redux';
import { startLoadPaths, terminateLoadPaths } from '../actions/paths';
import { CompositeDisposable } from 'atom';
import * as stores from '../reducers/index';

const redux = createRedux(stores);
const dispatch = redux.dispatch;

class AutocompleteSmartPaths {
  constructor() {
    this.provider = null;
    this.ready = false;

    this.disposables = new CompositeDisposable();
  }

  activate() {
    window.redux = redux;

    this.disposables.add(
      atom.project.onDidChangePaths(() => {
        if (redux.getState().paths.loading) {
          dispatch(terminateLoadPaths());
          dispatch(startLoadPaths());
        }
      })
    );

    dispatch(startLoadPaths());
    this.ready = true;
  }

  deactivate() {
    this.provider = null;
  }

  getProvider() {
    if (this.provider !== null) {
      return this.provider;
    }

    let PathsProvider = require('./paths-provider');
    this.provider = new PathsProvider(redux);
    return this.provider;
  }

  provide() {
    return this.getProvider();
  }
}

var smartPaths = new AutocompleteSmartPaths();

smartPaths.config = {
  pathReplacements: {
    type: 'array',
    default: ['/static/|'],
    description: `Define string replacements for paths when being loaded. eg "/static/|/public/" will turn
    the path /static/images/image.png to /public/images/image.png`
  },
  ignoredDirsAndFiles: {
    type: 'array',
    default: ['node_modules/', 'static.crane/', '/.eslint', '/.jshint'],
    description: 'Define ignored directories'
  },
  someSetting: {
    type: 'object',
    properties: {
      prop1: {
        type: 'string',
        default: 'Something'
      }
    }
  }
};

export default smartPaths;
