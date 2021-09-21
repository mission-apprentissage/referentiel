const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertEtablissement } = require("../../utils/fakeData");

describe(__filename, () => {
  it("Vérifie qu'on peut collecter des informations du fichier cci-france", async () => {
    await insertEtablissement({
      uai: "0111111Y",
      siret: "11111111100006",
    });

    let source = createSource("cci-france", {
      input: createStream(
        `uai
"0111111Y"`
      ),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("etablissements").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["cci-france"]);
    assert.deepStrictEqual(stats, {
      "cci-france": {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
