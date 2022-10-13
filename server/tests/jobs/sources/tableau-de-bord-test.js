const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { insertOrganisme } = require("../../utils/fakeData");
const { mockTableauDeBordApi } = require("../../utils/apiMocks");

describe("tableau-de-bord", () => {
  it("Vérifie qu'on peut collecter des informations pour un organisme", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    mockTableauDeBordApi((client, responses) => {
      client
        .get((uri) => uri.includes("cfas"))
        .query(() => true)
        .reply(
          200,
          responses.cfas({
            cfas: [
              {
                sirets: ["11111111100006"],
                uai: "0751234J",
                nom: "Organisme de formation",
                reseaux: ["cfa-reseau"],
                region_nom: "Normandie",
                region_num: "28",
                metiers: ["Vente en magasin : produits non alimentaires (vêtements, équipement, livres, …)"],
              },
            ],
          })
        );
    });

    const source = await createSource("tableau-de-bord");
    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne(
      { siret: "11111111100006" },
      { projection: { "uai_potentiels.date_collecte": 0, "reseaux.date_collecte": 0 } }
    );
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["tableau-de-bord"],
        uai: "0751234J",
      },
    ]);
    assert.deepStrictEqual(found.reseaux, [{ code: "cfa-reseau", label: "cfa-reseau", sources: ["tableau-de-bord"] }]);
    assert.deepStrictEqual(stats, {
      "tableau-de-bord": {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des informations pour plusieurs organismes", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    await insertOrganisme({ siret: "22222222200002" });
    mockTableauDeBordApi((client, responses) => {
      client
        .get((uri) => uri.includes("cfas"))
        .query(() => true)
        .reply(
          200,
          responses.cfas({
            cfas: [
              {
                sirets: ["11111111100006", "22222222200002"],
                reseaux: ["cfa ec"],
              },
            ],
          })
        );
    });

    const source = await createSource("tableau-de-bord");
    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne(
      { siret: "11111111100006" },
      { projection: { "reseaux.date_collecte": 0 } }
    );
    assert.deepStrictEqual(found.reseaux, [
      { code: "cfa ec", label: "Enseignement catholique", sources: ["tableau-de-bord"] },
    ]);
    assert.deepStrictEqual(stats, {
      "tableau-de-bord": {
        total: 2,
        updated: 2,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });
});
