const assert = require("assert");
const { Readable } = require("stream");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { insertEtablissement } = require("../../utils/fakeData");

function createAcceSource(array = {}) {
  let ndjson = array.map((i) => `${JSON.stringify(i)}\n`);

  return createSource("acce", {
    input: Readable.from(ndjson),
  });
}

describe(__filename, () => {
  it("Vérifie qu'on peut collecter des contacts", async () => {
    await insertEtablissement({ uai: "0111111Y", siret: "11111111100006" });
    let source = createAcceSource([
      {
        uai: "0111111Y",
        siret: "11111111100006",
        email: "robert@formation.fr",
        rattachements: { fille: [], mere: [] },
      },
    ]);

    let stats = await collectSources(source);

    let found = await dbCollection("etablissements").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.contacts, [
      {
        email: "robert@formation.fr",
        confirmé: false,
        sources: ["acce"],
      },
    ]);
    assert.deepStrictEqual(stats, {
      acce: {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
