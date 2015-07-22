"use babel";

/* eslint-disable no-reserved-keys */
/* globals atom */

import { createRedux } from 'redux';
import { startLoadPaths } from '../actions/paths';
import { CompositeDisposable } from 'atom';
import * as stores from '../reducers/index';
import * as config from './config';

const redux = window.redux = createRedux(stores);
const dispatch = redux.dispatch;

var reloadPaths = function() {
  dispatch(startLoadPaths());
};

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
          reloadPaths();
        }
      })
    );

    this.disposables.add(atom.config.onDidChange('atom-smart-path-autocomplete.staticRoot', reloadPaths));
    this.disposables.add(atom.config.onDidChange('atom-smart-path-autocomplete.useGitIgnore', reloadPaths));
    window.addEventListener('focus', reloadPaths);

    process.nextTick(() => dispatch(startLoadPaths()));
    this.ready = true;
  }

  deactivate() {
    this.provider = null;
  }

  getProvider() {
    if (this.provider !== null) {
      return this.provider;
    }

    let Provider = require('./provider');
    this.provider = new Provider(redux);
    return this.provider;
  }

  provide() {
    return this.getProvider();
  }
}
var plugin = new AutocompleteSmartPaths();
plugin.config = config.default;

export default plugin;
