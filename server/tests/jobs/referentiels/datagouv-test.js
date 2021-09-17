const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const importReferentiel = require("../../../src/jobs/importReferentiel");
const { createReferentiel } = require("../../../src/jobs/referentiels/referentiels");
const { createStream } = require("../../utils/testUtils");

describe(__filename, () => {
  it("Vérifie qu'on peut ajouter le référentiel datagouv", async () => {
    let referentiel = createReferentiel("datagouv", {
      input: createStream(`"siren";"num_etablissement";"cfa"
"111111111";"00006";"Oui"
"222222222";"00002";"Non"`),
    });

    let results = await importReferentiel(referentiel);

    let docs = await dbCollection("etablissements").find({}).toArray();
    assert.strictEqual(docs.length, 1);
    assert.deepStrictEqual(docs[0].referentiels, ["datagouv"]);
    assert.deepStrictEqual(results, {
      total: 1,
      created: 1,
      updated: 0,
      failed: 0,
    });
  });
});
