const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/tasks/collectSources");
const { importReferentiel, createStream } = require("../../utils/testUtils");

describe(__filename, () => {
  it("Vérifie qu'on peut collecter des informations du fichier ONISEP", async () => {
    await importReferentiel();
    let source = createSource("onisep", {
      input: createStream(
        `"code UAI";"n° SIRET";"nom"
"0111111Y";"11111111100006";"Centre de formation"`
      ),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("annuaire").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.uais, [
      {
        sources: ["onisep"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      onisep: {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
