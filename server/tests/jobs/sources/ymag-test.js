const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertOrganisme } = require("../../utils/fakeData");

describe("ymag", () => {
  it("Vérifie qu'on peut collecter des informations du fichier ymag", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createSource("ymag", {
      input: createStream(
        `siret;uai
"11 111 111 100 006";"0111111Y"`
      ),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["ymag"],
        uai: "0111111Y",
      },
    ]);
    assert.deepStrictEqual(stats, {
      ymag: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });
});
