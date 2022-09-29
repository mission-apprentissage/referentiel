const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { importOrganismesForTest, createStream } = require("../../utils/testUtils");

describe("onisep", () => {
  it("Vérifie qu'on peut collecter des informations du fichier ONISEP", async () => {
    await importOrganismesForTest();
    const source = createSource("onisep", {
      input: createStream(
        `"code UAI";"n° SIRET";"nom"
"0111111Y";"11111111100006";"Centre de formation"`
      ),
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne(
      { siret: "11111111100006" },
      { projection: { "uai_potentiels.date_maj": 0 } }
    );
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["onisep"],
        uai: "0111111Y",
      },
    ]);
    assert.deepStrictEqual(stats, {
      onisep: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });
});
