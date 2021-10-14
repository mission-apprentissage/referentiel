const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertEtablissement } = require("../../utils/fakeData");

describe("voeux-affelnet", () => {
  it("Vérifie qu'on peut collecter des emails à partir du fichier des voeux-affelnet (uai)", async () => {
    await insertEtablissement({ siret: "11111111100006", uai: "0111111Y" });
    let source = await createSource("voeux-affelnet", {
      input: createStream(
        `email;uai
"robert@formation.fr";"0111111Y"`
      ),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("etablissements").findOne({ siret: "11111111100006" }, { _id: 0 });
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

  it("Vérifie qu'on peut collecter des emails à partir du fichier des voeux-affelnet (siret)", async () => {
    await insertEtablissement({ siret: "11111111100006", uai: "0111111Y" });
    let source = await createSource("voeux-affelnet", {
      input: createStream(
        `email;uai;siret
"robert@formation.fr";"0222222X";"11111111100006"`
      ),
    });

    await collectSources(source);

    let found = await dbCollection("etablissements").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.contacts, [
      {
        email: "robert@formation.fr",
        confirmé: true,
        sources: ["voeux-affelnet"],
      },
    ]);
  });

  it("Vérifie qu'on ne met pas à jour un établisement qu'on le siret est vide", async () => {
    await insertEtablissement({ siret: "22222222200002", uai: "0751111A" });
    let source = await createSource("voeux-affelnet", {
      input: createStream(
        `email;uai
"robert@formation.fr";"0111111Y"`
      ),
    });

    let stats = await collectSources(source);

    assert.deepStrictEqual(stats, {
      "voeux-affelnet": {
        total: 1,
        updated: 0,
        ignored: 1,
        failed: 0,
      },
    });
  });
});
