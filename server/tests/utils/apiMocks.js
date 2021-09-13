const path = require("path");
const { readFileSync } = require("fs");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter"); // eslint-disable-line node/no-unpublished-require
const AcceApi = require("../../src/common/apis/AcceApi");

function createAxios(Api, responses, callback, options) {
  let instance = axios.create(options);
  let mock = new MockAdapter(instance);
  callback(mock, responses);
  return new Api({ axios: instance });
}

module.exports = {
  getMockedAcceApi(configureMocks, options = {}) {
    let responses = {
      index(file = "./fixtures/acceIndexResponse.html") {
        return readFileSync(path.join(__dirname, file), "UTF-8");
      },
      search(file = "./fixtures/acceSearchResponse.html") {
        return readFileSync(path.join(__dirname, file), "UTF-8");
      },
      etablissement(file = "./fixtures/acceEtablissementResponse.html") {
        return readFileSync(path.join(__dirname, file), "UTF-8");
      },
      noGeoloc(file = "./fixtures/noGeoloc.html") {
        return readFileSync(path.join(__dirname, file), "UTF-8");
      },
    };

    return createAxios(AcceApi, responses, configureMocks, options);
  },
};
