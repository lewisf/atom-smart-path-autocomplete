"use babel";

/* eslint-disable no-reserved-keys */
/* globals atom */

import { createRedux } from 'redux';
import { startLoadPaths, terminateLoadPaths } from '../actions/paths';
import { CompositeDisposable } from 'atom';
import * as stores from '../reducers/index';
import * as config from './config';

const redux = createRedux(stores);
const dispatch = redux.dispatch;

class AutocompleteSmartPaths {
  constructor() {
    this.provider = null;
    this.ready = false;

    this.disposables = new CompositeDisposable();
  }

  activate() {
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
var plugin = new AutocompleteSmartPaths();
plugin.config = config.default;

export default plugin;
