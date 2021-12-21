const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const { importOrganismesForTest, createStream } = require("../../utils/testUtils");
const collectSources = require("../../../src/jobs/collectSources");

describe("opcoep", () => {
  it("Vérifie qu'on peut collecter des informations du fichier OPCO EP", async () => {
    await importOrganismesForTest();
    let source = createSource("opcoep", {
      input: createStream(
        `SIRET CFA;N UAI CFA;Nom CFA
"11111111100006";"0111111Y";"Centre de formation"`
      ),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["opcoep"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      opcoep: {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
