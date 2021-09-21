const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertEtablissement } = require("../../utils/fakeData");

describe(__filename, () => {
  it("Vérifie qu'on peut collecter des informations du fichier uimm", async () => {
    await insertEtablissement({ siret: "11111111100006" });
    let source = createSource("uimm", {
      input: createStream(
        `siret;uai
"11111111100006";"0111111Y"`
      ),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("etablissements").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["uimm"]);
    assert.deepStrictEqual(found.uais, [
      {
        sources: ["uimm"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      uimm: {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
