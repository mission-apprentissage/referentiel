const assert = require("assert");
const { Readable } = require("stream");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { insertOrganisme } = require("../../utils/fakeData");

function createAcceSource(array = {}) {
  let ndjson = array.map((i) => `${JSON.stringify(i)}\n`);

  return createSource("acce", {
    input: Readable.from(ndjson),
  });
}

describe("acce", () => {
  it("Vérifie qu'on peut collecter des contacts", async () => {
    await insertOrganisme({
      siret: "11111111100006",
      uai: "0111111Y",
    });
    let source = createAcceSource([
      {
        uai: "0111111Y",
        email: "robert@formation.fr",
        rattachements: { fille: [], mere: [] },
      },
    ]);

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
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
