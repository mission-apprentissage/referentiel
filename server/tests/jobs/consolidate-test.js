const assert = require("assert");
const consolidate = require("../../src/jobs/consolidate");
const { dbCollection } = require("../../src/common/db/mongodb");
const { insertOrganisme, insertModification } = require("../utils/fakeData");
const { DateTime } = require("luxon");

describe("consolidate", () => {
  it("Vérifie qu'on peut valider un uai à partir des modifications", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    await insertModification({
      siret: "11111111100006",
      changements: {
        uai: "0751234J",
      },
    });

    let stats = await consolidate();

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.strictEqual(found.uai, "0751234J");
    assert.deepStrictEqual(stats, {
      modifications: {
        total: 1,
        modifications: 1,
        unknown: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on joue les modifications dans l'ordre chronologique", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let yesterday = DateTime.now().minus({ hour: 24 }).toJSDate();
    await insertModification({
      siret: "11111111100006",
      date: yesterday,
      changements: {
        uai: "0751234J",
      },
    });
    await insertModification({
      siret: "11111111100006",
      date: DateTime.now().toJSDate(),
      changements: {
        uai: "0751234X",
      },
    });

    let stats = await consolidate();

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.strictEqual(found.uai, "0751234X");
    assert.deepStrictEqual(stats, {
      modifications: {
        total: 2,
        modifications: 2,
        unknown: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on compte les établisements inconnus", async () => {
    await insertModification({
      siret: "11111111100006",
      changements: {
        uai: "0751234J",
      },
    });

    let stats = await consolidate();

    assert.deepStrictEqual(stats, {
      modifications: {
        total: 1,
        modifications: 0,
        unknown: 1,
        failed: 0,
      },
    });
  });
});
