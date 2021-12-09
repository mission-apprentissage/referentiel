const assert = require("assert");
const consolidate = require("../../src/jobs/consolidate");
const { dbCollection } = require("../../src/common/db/mongodb");
const { insertEtablissement, insertModification } = require("../utils/fakeData");

describe("consolidate", () => {
  it("Vérifie qu'on peut valider un uai", async () => {
    await insertEtablissement({
      siret: "11111111100006",
      uais: [
        {
          sources: ["dummy"],
          uai: "0751234J",
          valide: true,
        },
      ],
    });
    await insertModification({
      siret: "11111111100006",
      uai: "0751234J",
    });

    let stats = await consolidate();

    const found = await dbCollection("etablissements").findOne({ siret: "11111111100006" });
    assert.strictEqual(found.uai, "0751234J");
    assert.deepStrictEqual(stats, {
      total: 1,
      updated: 1,
      unknown: 0,
      failed: 0,
    });
  });

  it("Vérifie qu'on compte les établisements inconnus", async () => {
    await insertModification({
      siret: "11111111100006",
      uai: "0751234J",
    });

    let stats = await consolidate();

    assert.deepStrictEqual(stats, {
      total: 1,
      updated: 0,
      unknown: 1,
      failed: 0,
    });
  });
});
