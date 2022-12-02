const rsshubConfig = require("rsshub/lib/config");
const request = require("supertest");
let app;

class ResponseError extends Error {
  constructor(response) {
    super(response.res.statusMessage);
    this.name = `ResponseError`;
    this.status = response.status;
    this.text = response.text;
  }
}

const rsshub = {
  init: async (conf) => {
    console.debug(conf)
    rsshubConfig.set(
      {
        ...conf,
        IS_PACKAGE: true
      }
    );
    app = require("rsshub/lib/app");
  },
  get: async (url) => {
    const response = await request(app.callback()).get(url);
    if (response.status < 300) {
      if (response.body.error) {
        return Promise.reject(new Error(response.body.error.message));
      } else {
        return response.body;
      }
    } else {
      return Promise.reject(new ResponseError(response));
    }
  }
};

module.exports = rsshub;
