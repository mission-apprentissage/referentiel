const { Readable } = require("stream");
const importEtablissements = require("../../src/jobs/importEtablissements");
const server = require("../../src/http/server");
const axiosist = require("axiosist");
const { oleoduc, transformData } = require("oleoduc"); // eslint-disable-line node/no-unpublished-require

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

module.exports = {
  createStream,
  startServer,
  importEtablissements: (array = [{ siret: "11111111100006" }]) => {
    return importEtablissements({
      name: "test",
      stream() {
        return oleoduc(
          Readable.from(array),
          transformData((data) => ({ from: "test", selector: data.siret })),
          { promisify: false }
        );
      },
    });
  },
};
