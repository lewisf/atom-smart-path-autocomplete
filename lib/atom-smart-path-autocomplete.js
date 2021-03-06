'use babel';

import Watcher from './watcher';
import path from 'path';

import * as stores from '../reducers/index';
import { createStore, combineReducers } from 'redux';
import { addPath, removePath } from '../actions/paths';
import SubscriptionUpdate from './subscriptionUpdate';

const redux = window.redux = createStore(combineReducers(stores));


/* eslint-disable no-reserved-keys */
/* globals atom */

class AutocompleteSmartPaths {
  constructor() {
    this.provider = null;
    this.ready = false;
  }

  activate() {
    this.ready = true;
    this.watcher = new Watcher();

    this.watcher.onSubscriptionUpdate(update => {
      var files = (new SubscriptionUpdate(update)).getFiles();
      files.forEach(file => {
        if (file.exists) {
          redux.dispatch(addPath(file.name));
        } else {
          redux.dispatch(removePath(file.name));
        }
      });
    });


    const projectRoot = atom.project.getPaths()[0];
    this.watcher.watchProject(projectRoot)
      .then(response => {
        this.watcher.subscribe({
          watch: path.join(response.watch, response.relative_path || ''),
          subscriptionName: 'projectSubscription',
          subscriptionDetails: {
            expression: ['anyof',
              ['match', '*.js'],
              ['match', '*.jsx']
            ],
            fields: ['name', 'size', 'exists', 'type']
          },
          // TODO: Change this to configurable option with default
          relative_root: 'static/',  // watchman requires snake case
        });
      }, (error) => {
        console.error(`Error initiating watch: ${error}`);
        return;
      });
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
export default plugin;
