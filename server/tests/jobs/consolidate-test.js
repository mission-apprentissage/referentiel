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
      obsolete: {
        collecte: 0,
        organismes: 0,
      },
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
      obsolete: {
        collecte: 0,
        organismes: 0,
      },
      modifications: {
        total: 2,
        modifications: 2,
        unknown: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on compte les établisements inconnus dans les modifications", async () => {
    await insertModification({
      siret: "11111111100006",
      changements: {
        uai: "0751234J",
      },
    });

    const stats = await consolidate();

    assert.deepStrictEqual(stats, {
      obsolete: {
        collecte: 0,
        organismes: 0,
      },
      modifications: {
        total: 1,
        modifications: 0,
        unknown: 1,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on supprime les données obsolètes (non collecté depuis x jours)", async () => {
    const collectDate = new Date();
    const obsoleteDate = DateTime.fromJSDate(collectDate).minus({ day: 8 }).toJSDate();
    await insertOrganisme({
      siret: "11111111100006",
      relations: [
        {
          type: "responsable->formateur",
          siret: "22222222200002",
          label: "Organisme de formation",
          referentiel: true,
          sources: ["catalogue"],
          date_collecte: collectDate,
        },
        {
          type: "responsable->formateur",
          siret: "33333333300008",
          label: "Organisme de formation",
          referentiel: true,
          sources: ["catalogue"],
          date_collecte: obsoleteDate,
        },
      ],
      _meta: {
        date_collecte: collectDate,
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
        date_collecte: collectDate,
      },
    ]);
    assert.deepStrictEqual(stats, {
      obsolete: {
        collecte: 1,
        organismes: 0,
      },
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
          date_collecte: collectDate,
        },
      ],
      _meta: {
        date_collecte: collectDate,
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
        date_collecte: collectDate,
      },
    ]);
    assert.deepStrictEqual(stats, {
      obsolete: {
        collecte: 0,
        organismes: 0,
      },
      modifications: {
        total: 0,
        modifications: 0,
        unknown: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on supprime un organisme qui est obsolète (non importé depuis x jours)", async () => {
    const obsoleteDate = DateTime.now().minus({ day: 10 }).toJSDate();
    const recentDate = new Date();
    await Promise.all([
      insertOrganisme({
        siret: "11111111100006",
        etat_administratif: "fermé",
        _meta: {
          date_dernier_import: recentDate,
        },
      }),
      insertOrganisme({
        siret: "22222222200002",
        etat_administratif: "fermé",
        _meta: {
          date_dernier_import: obsoleteDate,
        },
      }),
      insertOrganisme({
        siret: "33333333300003",
        etat_administratif: "actif",
        uai: "0751234J",
        _meta: {
          date_dernier_import: obsoleteDate,
        },
      }),
      insertOrganisme({
        siret: "44444444400003",
        etat_administratif: "fermé",
        uai: "0751234J",
        _meta: {
          date_dernier_import: obsoleteDate,
        },
      }),
    ]);

    const stats = await consolidate();

    assert.ok(await dbCollection("organismes").findOne({ siret: "11111111100006" }));
    assert.ok(!(await dbCollection("organismes").findOne({ siret: "22222222200002" })));
    assert.ok(await dbCollection("organismes").findOne({ siret: "33333333300003" }));
    assert.ok(!(await dbCollection("organismes").findOne({ siret: "44444444400006" })));

    assert.deepStrictEqual(stats, {
      obsolete: {
        organismes: 2,
        collecte: 0,
      },
      modifications: {
        total: 0,
        modifications: 0,
        unknown: 0,
        failed: 0,
      },
    });
  });
});
