const assert = require("assert");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { insertOrganisme, insertAcce } = require("../../utils/fakeData");

describe("acce", () => {
  it("Vérifie qu'on peut collecter des contacts", async () => {
    const source = createSource("acce");
    await insertOrganisme({
      siret: "11111111100006",
      uai: "0111111Y",
    });
    await insertAcce({
      numero_uai: "0111111Y",
      mel_uai: "robert@formation.fr",
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne(
      { siret: "11111111100006" },
      { projection: { "contacts.date_vue": 0 } }
    );
    assert.deepStrictEqual(found.contacts, [
      {
        email: "robert@formation.fr",
        confirmé: false,
        sources: ["acce"],
      },
    ]);
    assert.deepStrictEqual(stats, {
      acce: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });
});
