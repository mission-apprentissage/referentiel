const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertOrganisme } = require("../../utils/fakeData");

describe("ifocop", () => {
  it("Vérifie qu'on peut collecter l'UAI et le reseau", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createSource("ifocop", {
      input: createStream(`"SIRET";"UAI"
"11111111100006";"0111111Y"`),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["ifocop"]);
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["ifocop"],
        uai: "0111111Y",
      },
    ]);
    assert.deepStrictEqual(stats, {
      ifocop: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });
});
