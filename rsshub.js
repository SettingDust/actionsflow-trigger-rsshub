const rsshubConfig = require("rsshub/lib/config");
const request = require("supertest");
const { refreshToken } = require("rsshub/lib/routes/pixiv/token");
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
    rsshubConfig.set(
      Object.assign(
        {
          IS_PACKAGE: true
        },
        conf
      )
    );
    app = require("rsshub/lib/index");
    if (rsshubConfig.value.pixiv) {
      await refreshToken()
    }
  },
  get: async (url) => {
    const response = await request(app).get(url);
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
