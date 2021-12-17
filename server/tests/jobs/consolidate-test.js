const assert = require("assert");
const consolidate = require("../../src/jobs/consolidate");
const { dbCollection } = require("../../src/common/db/mongodb");
const { insertEtablissement, insertModification } = require("../utils/fakeData");
const { DateTime } = require("luxon");

describe("consolidate", () => {
  it("Vérifie qu'on peut valider un uai à partir des modifications", async () => {
    await insertEtablissement({ siret: "11111111100006" });
    await insertModification({ siret: "11111111100006", uai: "0751234J" });

    let stats = await consolidate();

    const found = await dbCollection("etablissements").findOne({ siret: "11111111100006" });
    assert.strictEqual(found.uai, "0751234J");
    assert.deepStrictEqual(stats, {
      total: 1,
      modifications: 1,
      unknown: 0,
      failed: 0,
    });
  });

  it("Vérifie qu'on joue les modifications dans l'ordre chronologique", async () => {
    await insertEtablissement({ siret: "11111111100006" });
    let yesterday = DateTime.now().minus({ hour: 24 }).toJSDate();
    await insertModification({ siret: "11111111100006", uai: "0751234J", date: yesterday });
    await insertModification({ siret: "11111111100006", uai: "0751234X", date: DateTime.now().toJSDate() });

    let stats = await consolidate();

    const found = await dbCollection("etablissements").findOne({ siret: "11111111100006" });
    assert.strictEqual(found.uai, "0751234X");
    assert.deepStrictEqual(stats, {
      total: 2,
      modifications: 2,
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
      modifications: 0,
      unknown: 1,
      failed: 0,
    });
  });
});
