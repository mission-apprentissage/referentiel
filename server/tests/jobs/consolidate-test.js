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

    const stats = await consolidate();

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.strictEqual(found.uai, "0751234J");
    assert.deepStrictEqual(stats, {
      obsolete: 0,
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
    const yesterday = DateTime.now().minus({ hour: 24 }).toJSDate();
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

    const stats = await consolidate();

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.strictEqual(found.uai, "0751234X");
    assert.deepStrictEqual(stats, {
      obsolete: 0,
      modifications: {
        total: 2,
        modifications: 2,
        unknown: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on compte les établisements inconnus dans les moodifications", async () => {
    await insertModification({
      siret: "11111111100006",
      changements: {
        uai: "0751234J",
      },
    });

    const stats = await consolidate();

    assert.deepStrictEqual(stats, {
      obsolete: 0,
      modifications: {
        total: 1,
        modifications: 0,
        unknown: 1,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on supprime les données obsolètes (non mise à jour x jours avant la dernière collecte)", async () => {
    const collectDate = new Date();
    const obsoleteDate = DateTime.now().minus({ day: 8 }).toJSDate();
    await insertOrganisme({
      siret: "11111111100006",
      relations: [
        {
          type: "responsable->formateur",
          siret: "22222222200002",
          label: "Organisme de formation",
          referentiel: true,
          sources: ["catalogue"],
          date_vue: collectDate,
        },
        {
          type: "responsable->formateur",
          siret: "33333333300008",
          label: "Organisme de formation",
          referentiel: true,
          sources: ["catalogue"],
          date_vue: obsoleteDate,
        },
      ],
      _meta: {
        date_vue: collectDate,
      },
    });

    const stats = await consolidate();

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found.relations, [
      {
        type: "responsable->formateur",
        siret: "22222222200002",
        label: "Organisme de formation",
        referentiel: true,
        sources: ["catalogue"],
        date_vue: collectDate,
      },
    ]);
    assert.deepStrictEqual(stats, {
      obsolete: 1,
      modifications: {
        total: 0,
        modifications: 0,
        unknown: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on préserve les données obsolètes quand l'organisme n'a pas été mis à jour", async () => {
    const collectDate = DateTime.now().minus({ day: 10 }).toJSDate();
    await insertOrganisme({
      siret: "11111111100006",
      relations: [
        {
          type: "responsable->formateur",
          siret: "33333333300008",
          label: "Organisme de formation",
          referentiel: true,
          sources: ["catalogue"],
          date_vue: collectDate,
        },
      ],
      _meta: {
        date_vue: collectDate,
      },
    });

    const stats = await consolidate();

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found.relations, [
      {
        type: "responsable->formateur",
        siret: "33333333300008",
        label: "Organisme de formation",
        referentiel: true,
        sources: ["catalogue"],
        date_vue: collectDate,
      },
    ]);
    assert.deepStrictEqual(stats, {
      obsolete: 0,
      modifications: {
        total: 0,
        modifications: 0,
        unknown: 0,
        failed: 0,
      },
    });
  });
});
