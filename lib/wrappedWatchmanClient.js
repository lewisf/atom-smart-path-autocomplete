'use babel';

var watchman = require('fb-watchman');

/**
 * @typedef {Object} WatchmanSubscribeCommandResponse
 * @property {string} version Version number of watchman
 * @property {string} watch Directory being watched
 * @property {string} relative_path Relative path of directory being watched.
 */

export default class WrappedWatchmanClient {

  constructor() {
    this.client = new watchman.Client();
  }

  getClient() {
    return this.client;
  }
}
