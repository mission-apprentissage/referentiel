const assert = require("assert");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/tasks/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertAnnuaire } = require("../../utils/fakeData");
const { getCollection } = require("../../../src/common/db/mongodb");

describe(__filename, () => {
  it("Vérifie qu'on peut collecter des informations du fichier anasup", async () => {
    await insertAnnuaire({ siret: "11111111100006", uai: "1111111A" });
    let source = createSource("anasup", {
      input: createStream(
        `siret;uai
"11111111100006";"0111111Y"`
      ),
    });

    let stats = await collectSources(source);

    let found = await getCollection("annuaire").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["anasup"]);
    assert.deepStrictEqual(found.uais, [
      {
        sources: ["anasup"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      anasup: {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
