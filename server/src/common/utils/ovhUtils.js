// eslint-disable-next-line node/no-extraneous-require
const axios = require("axios");
const config = require("../../config");
const { fetchStream } = require("./httpUtils");

async function authenticate(uri) {
  const regExp = new RegExp(/^(https:\/\/)(.+):(.+):(.+)@(.*)$/);

  if (!regExp.test(uri)) {
    throw new Error("Invalid OVH URI");
  }

  const [, protocol, user, password, tenantId, authUrl] = uri.match(regExp);
  const response = await axios.post(`${protocol}${authUrl}`, {
    auth: {
      identity: {
        tenantId,
        methods: ["password"],
        password: {
          user: {
            name: user,
            password: password,
            domain: {
              name: "Default",
            },
          },
        },
      },
    },
  });

  const token = response.headers["x-subject-token"];
  const { endpoints } = response.data.token.catalog.find((c) => c.type === "object-store");
  const { url: baseUrl } = endpoints.find((s) => s.region === "GRA");

  return { baseUrl, token };
}

async function requestObjectAccess(path, options = {}) {
  const storage = options.storage || config.ovh.storage.storageName;
  const { baseUrl, token } = await authenticate(config.ovh.storage.uri);

  return {
    url: encodeURI(`${baseUrl}/${storage}${path === "/" ? "" : `/${path}`}`),
    token,
  };
}

module.exports = {
  getFromStorage: async (path, options = {}) => {
    const { url, token } = await requestObjectAccess(path, options);
    return fetchStream(url, {
      method: "GET",
      headers: {
        "X-Auth-Token": token,
        "Accept": "application/json",
      },
    });
  },
};
