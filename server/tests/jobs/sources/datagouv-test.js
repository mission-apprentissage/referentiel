const assert = require("assert");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const importOrganismes = require("../../../src/jobs/importOrganismes");
const { insertOrganisme, insertDatagouv } = require("../../utils/fakeData");
const { dbCollection } = require("../../../src/common/db/mongodb");

describe("datagouv", () => {
  it("Vérifie qu'on peut convertir la source en référentiel", async () => {
    await Promise.all([
      insertDatagouv({
        siren: "111111111",
        siretEtablissementDeclarant: "11111111100006",
        certifications: { actionsDeFormationParApprentissage: true },
      }),
      insertDatagouv({
        siren: "111111111",
        siretEtablissementDeclarant: "11111111100007",
        certifications: { actionsDeFormationParApprentissage: false },
      }),
    ]);

    const source = createSource("datagouv");

    const stats = await importOrganismes(source);

    const docs = await dbCollection("organismes").find({}, { _id: 0 }).toArray();
    assert.deepStrictEqual(docs.length, 1);
    assert.deepStrictEqual(docs[0].siret, "11111111100006");
    assert.deepStrictEqual(stats, {
      datagouv: {
        created: 1,
        failed: 0,
        invalid: 0,
        total: 1,
        updated: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des informations de la liste publique des organismes de formation", async () => {
    await Promise.all([
      insertOrganisme({ siret: "11111111100006" }),
      insertOrganisme({ siret: "22222222200002" }),
      insertDatagouv({
        numeroDeclarationActivite: "88888888888",
        siren: "111111111",
        siretEtablissementDeclarant: "11111111100006",
        certifications: { actionsDeFormationParApprentissage: true },
      }),
    ]);
    const source = createSource("datagouv");

    const stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.numero_declaration_activite, "88888888888");
    assert.deepStrictEqual(found.qualiopi, true);
    found = await dbCollection("organismes").findOne({ siret: "22222222200002" }, { _id: 0 });
    assert.deepStrictEqual(found.numero_declaration_activite, undefined);
    assert.deepStrictEqual(found.qualiopi, undefined);
    assert.deepStrictEqual(stats, {
      datagouv: {
        total: 2,
        updated: 1,
        unknown: 1,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on déduit les données nda/qualiopi pour les organismes avec le même siren", async () => {
    await Promise.all([
      insertOrganisme({ siret: "11111111100006" }),
      insertOrganisme({ siret: "11111111100007" }),
      insertDatagouv({
        numeroDeclarationActivite: "88888888888",
        siren: "111111111",
        siretEtablissementDeclarant: "11111111100006",
        certifications: { actionsDeFormationParApprentissage: true },
      }),
    ]);
    const source = createSource("datagouv");

    await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100007" }, { _id: 0 });
    assert.deepStrictEqual(found.numero_declaration_activite, "88888888888");
    assert.deepStrictEqual(found.qualiopi, true);
  });

  it("Vérifie qu'on privilégie les données datagouv pour les organismes avec le même siren", async () => {
    await Promise.all([
      insertOrganisme({ siret: "11111111100006" }),
      insertOrganisme({ siret: "11111111100007" }),
      insertDatagouv({
        numeroDeclarationActivite: "88888888888",
        siren: "111111111",
        siretEtablissementDeclarant: "11111111100006",
        certifications: { actionsDeFormationParApprentissage: true },
      }),
      insertDatagouv({
        numeroDeclarationActivite: "99999999999",
        siren: "111111111",
        siretEtablissementDeclarant: "11111111100007",
        certifications: { actionsDeFormationParApprentissage: false },
      }),
    ]);
    const source = createSource("datagouv");

    await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100007" }, { _id: 0 });
    assert.deepStrictEqual(found.numero_declaration_activite, "99999999999");
    assert.deepStrictEqual(found.qualiopi, false);
  });

  it("Vérifie que peut charger en mémoire la liste des organismes de formation", async () => {
    await insertDatagouv({
      numeroDeclarationActivite: "88888888888",
      siren: "111111111",
      siretEtablissementDeclarant: "11111111100006",
      certifications: { actionsDeFormationParApprentissage: true },
    });

    const source = createSource("datagouv");

    const organismes = await source.loadSirets();

    assert.strictEqual(organismes.length, 1);
    assert.deepStrictEqual(organismes[0], "11111111100006");
  });
});
