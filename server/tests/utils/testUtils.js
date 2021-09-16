const { Readable } = require("stream");
const { createReferentiel } = require("../../src/jobs/referentiels/referentiels");
const importReferentiel = require("../../src/jobs/importReferentiel");
const server = require("../../src/http/server");
const axiosist = require("axiosist"); // eslint-disable-line node/no-unpublished-require

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
  importReferentiel: (content) => {
    let referentiel = createReferentiel("datagouv", {
      input: createStream(
        content ||
          `"siren";"num_etablissement";"cfa"
"111111111";"00006";"Oui"`
      ),
    });

    return importReferentiel(referentiel);
  },
};
