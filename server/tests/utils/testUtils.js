const { Readable } = require("stream");
const importOrganismes = require("../../src/jobs/importOrganismes");
const server = require("../../src/http/server");
const axiosist = require("axiosist"); // eslint-disable-line node/no-unpublished-require
const { compose, transformData } = require("oleoduc");
const { buildJwtToken } = require("../../src/common/utils/jwtUtils");

const createStream = (content) => {
  const stream = new Readable({
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

function generateAuthHeader(email, type, code, isAdmin = false) {
  return {
    Authorization: `Bearer ${buildJwtToken(email, type, code, isAdmin)}`,
  };
}

module.exports = {
  createStream,
  startServer,
  generateAuthHeader,
  importOrganismesForTest: (array = [{ siret: "11111111100006" }]) => {
    return importOrganismes({
      name: "test",
      referentiel() {
        return compose(
          Readable.from(array),
          transformData((data) => ({ from: "test", siret: data.siret }))
        );
      },
    });
  },
};
