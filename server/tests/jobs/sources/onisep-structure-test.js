const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { importOrganismesForTest, createStream } = require("../../utils/testUtils");

describe("onisep-structure", () => {
  it("Vérifie qu'on peut collecter des informations du fichier ONISEP (structure)", async () => {
    await importOrganismesForTest();
    const source = createSource("onisep-structure", {
      input: createStream(
        `STRUCT SIRET;STRUCT UAI;STRUCT Libellé Amétys
"11111111100006";"0111111Y";"Centre de formation"`
      ),
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["onisep-structure"],
        uai: "0111111Y",
      },
    ]);
    assert.deepStrictEqual(stats, {
      "onisep-structure": {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });
});
