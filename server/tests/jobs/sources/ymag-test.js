const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertEtablissement } = require("../../utils/fakeData");

describe("ymag", () => {
  it("Vérifie qu'on peut collecter des informations du fichier ymag", async () => {
    await insertEtablissement({ siret: "11111111100006" });
    let source = createSource("ymag", {
      input: createStream(
        `siret;uai
"11 111 111 100 006";"0111111Y"`
      ),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("etablissements").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.uais, [
      {
        sources: ["ymag"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      ymag: {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
