const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertOrganisme } = require("../../utils/fakeData");

describe("voeux-affelnet", () => {
  it("Vérifie qu'on peut collecter des informations à partir du fichier des voeux-affelnet", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    const source = await createSource("voeux-affelnet", {
      input: createStream(
        `email;siret;dernier_email
"robert@formation.fr";"11111111100006";"notification"`
      ),
    });

    await collectSources(source);

    const found = await dbCollection("organismes").findOne(
      { siret: "11111111100006" },
      { projection: { "contacts.date_collecte": 0 } }
    );
    assert.deepStrictEqual(found.contacts, [
      {
        email: "robert@formation.fr",
        confirmé: true,
        sources: ["voeux-affelnet"],
      },
    ]);
  });

  it("Vérifie qu'on ignore les établissements n'ayant pas activé leur compte", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    const source = await createSource("voeux-affelnet", {
      input: createStream(
        `email;siret;dernier_email
"robert@formation.fr";"11111111100006";"activation_cfa"`
      ),
    });

    await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.contacts, []);
  });
});
