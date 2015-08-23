'use babel';
/**
 * Watchman subscription handler.
 *
 * Adapter to give us more control over each subscription update.
 */

export default class SubscriptionUpdate {
  constructor(subscriptionObject) {
    this.clock = subscriptionObject.clock;
    this.files = subscriptionObject.files;
    this.isFreshInstance = subscriptionObject.is_fresh_instance;
    this.root = subscriptionObject.root;
    this.subscription = subscriptionObject.subscription;
    this.version = subscriptionObject.version;
  }

  getFiles() {
    return this.files
      .filter(file => file.type === 'f')
      .map(file => ({
        exists: file.exists,
        name: file.name
      }));
  }

}
