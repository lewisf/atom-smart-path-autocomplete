'use babel';

import Promise from 'bluebird';
Promise.longStackTraces();
import WrappedWatchmanClient from './wrappedWatchmanClient';
import SubscriptionUpdate from './subscriptionUpdate';

/**
 * @typedef {Object} WatchmanWatchProjectCommandResponse
 * @property {string} version Version number of watchman
 * @property {string} watch Directory being watched
 * @property {string} relative_path Relative path of directory being watched.
 */

export default class Watcher {

  constructor() {
    this.wrappedClient = new WrappedWatchmanClient();
  }

  /**
   * Do a watchman watch-project command.
   *
   * @param  {string}} directory Directory to watch
   *
   * @return {Promise.<WatchmanWatchProjectCommandResponse>} watchman watch-project response.
   */
  watchProject(directory) {
    var client = this.wrappedClient.getClient();
    return new Promise((resolve, reject) => {
      client.command(['watch-project', directory], (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Subscribe to a watchman client .
   *
   * @param  {object} watch watchman watch object - you get this from watch-project
   * @param  {string} subscriptionName name of this subscription
   * @param  {object} subscriptionDetails subscription details
   *
   * @return {Promise.<WatchmanSubscribeCommandResponse>} success or fail.
   */
  subscribe({watch, subscriptionName, subscriptionDetails, relativeRoot}) {
    var client = this.wrappedClient.getClient();
    return new Promise((resolve, reject) => {
      client.command(['subscribe', watch, subscriptionName, subscriptionDetails], (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(new SubscriptionUpdate(response));
        }
      });
    });
  }

  onSubscriptionUpdate(callback) {
    var client = this.wrappedClient.getClient();
    client.on('subscription', callback);
  }

}
