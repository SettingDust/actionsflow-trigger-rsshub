const rsshub = require("./rsshub");
const config = require("rsshub/lib/config").value;
const run = require("./run");
module.exports = class Rsshub {
  constructor({ helpers, options }) {
    this.options = options;
    this.helpers = helpers;
  }
  async run() {
    return await run({
      triggerOptions: this.options,
      rsshub,
      config,
    });
  }
  getItemKey(item) {
    // TODO adapt every cases
    if (item.guid) return item.guid;
    if (item.link) return item.link;
    if (item.id) return item.id;
    return this.helpers.createContentDigest(item);
  }
};
