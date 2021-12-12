const { Readable } = require("stream");
const importEtablissements = require("../../src/jobs/importEtablissements");
const server = require("../../src/http/server");
const axiosist = require("axiosist"); // eslint-disable-line node/no-unpublished-require
const { compose, transformData } = require("oleoduc");
const { buildApiToken } = require("../../src/common/utils/jwtUtils");

let createStream = (content) => {
  let stream = new Readable({
    objectMode: true,
    read() {},
  });

  stream.push(content);
  stream.push(null);

  return stream;
};

async function startServer() {
  const app = await server();
  const httpClient = axiosist(app);

  return {
    httpClient,
  };
}

function generateAuthHeader(type, code) {
  return {
    Authorization: `Bearer ${buildApiToken(type, code)}`,
  };
}

module.exports = {
  createStream,
  startServer,
  generateAuthHeader,
  importEtablissements: (array = [{ siret: "11111111100006" }]) => {
    return importEtablissements({
      name: "test",
      stream() {
        return compose(
          Readable.from(array),
          transformData((data) => ({ from: "test", selector: data.siret }))
        );
      },
    });
  },
};
