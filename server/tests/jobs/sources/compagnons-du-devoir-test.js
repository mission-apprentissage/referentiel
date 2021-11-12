const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertEtablissement } = require("../../utils/fakeData");

describe("compagnons-du-devoir", () => {
  it("Vérifie qu'on peut collecter des informations du fichier compagnons-du-devoir", async () => {
    await insertEtablissement({ siret: "11111111100006" });
    let source = createSource("compagnons-du-devoir", {
      input: createStream(
        `siret;uai
"11111111100006";"0111111Y"`
      ),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("etablissements").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["compagnons-du-devoir"]);
    assert.deepStrictEqual(found.uais, [
      {
        sources: ["compagnons-du-devoir"],
        uai: "0111111Y",
        valide: true,
        confirmé: false,
      },
    ]);
    assert.deepStrictEqual(stats, {
      "compagnons-du-devoir": {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
