const assert = require("assert");
const { getCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/tasks/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertAnnuaire } = require("../../utils/fakeData");

describe(__filename, () => {
  it("Vérifie qu'on peut collecter des emails à partir du fichier des voeux-affelnet", async () => {
    await insertAnnuaire({ siret: "11111111100006", uai: "0111111Y" });
    let source = await createSource("voeux-affelnet", {
      input: createStream(
        `email;uai
"robert@formation.fr";"0111111Y"`
      ),
    });

    let stats = await collectSources(source);

    let found = await getCollection("annuaire").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.contacts, [
      {
        email: "robert@formation.fr",
        confirmé: true,
        sources: ["voeux-affelnet"],
      },
    ]);
    assert.deepStrictEqual(stats, {
      "voeux-affelnet": {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
