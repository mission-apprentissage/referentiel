const axios = require("axios");
const config = require("../../config");
const { getFileAsStream } = require("./httpUtils");

let getAuth = async (uri) => {
  let regExp = new RegExp(/^(https:\/\/)(.+):(.+):(.+)@(.*)$/);

  if (!regExp.test(uri)) {
    throw new Error("Invalid OVH URI");
  }

  let [, protocol, user, password, tenantId, authUrl] = uri.match(regExp);
  let response = await axios.post(`${protocol}${authUrl}`, {
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

  let token = response.headers["x-subject-token"];
  let { endpoints } = response.data.token.catalog.find((c) => c.type === "object-store");
  let { url } = endpoints.find((s) => s.region === "GRA");

  return { token, baseUrl: url };
};

module.exports = {
  getOvhFileAsStream: async (relativePath, options = {}) => {
    let storage = options.storage || "mna-tables-correspondances";
    let { token, baseUrl } = await getAuth(config.ovh.storage.uri);

    let fullPath = encodeURI(`${baseUrl}/${storage}/${relativePath}`);
    return getFileAsStream(fullPath, {
      headers: {
        "X-Auth-Token": token,
        Accept: "application/json",
      },
    });
  },
};
