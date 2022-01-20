const assert = require("assert");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const importOrganismes = require("../../../src/jobs/importOrganismes");
const { insertOrganisme, insertDatagouv } = require("../../utils/fakeData");
const { dbCollection } = require("../../../src/common/db/mongodb");

describe("datagouv", () => {
  it("Vérifie que peut convertir la source en référentiel", async () => {
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

    let source = createSource("datagouv");

    let stats = await importOrganismes(source);

    let docs = await dbCollection("organismes").find({}, { _id: 0 }).toArray();
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
      insertOrganisme({ siret: "11111111100007" }),
      insertOrganisme({ siret: "22222222200002" }),
      insertDatagouv({
        numeroDeclarationActivite: "88888888888",
        siren: "111111111",
        siretEtablissementDeclarant: "11111111100006",
        certifications: { actionsDeFormationParApprentissage: true },
      }),
    ]);
    let source = createSource("datagouv");

    let stats = await collectSources(source);

    let docs = await dbCollection("organismes").find({}, { _id: 0 }).sort({ siret: 1 }).toArray();
    assert.deepStrictEqual(docs[0].numero_declaration_activite, "88888888888");
    assert.deepStrictEqual(docs[1].numero_declaration_activite, "88888888888");
    assert.deepStrictEqual(docs[2].numero_declaration_activite, undefined);
    assert.deepStrictEqual(docs[0].qualiopi, true);
    assert.deepStrictEqual(docs[1].qualiopi, true);
    assert.deepStrictEqual(docs[2].qualiopi, undefined);
    assert.deepStrictEqual(stats, {
      datagouv: {
        total: 1,
        updated: 2,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie que peut charger en mémoire la liste des CFA", async () => {
    await insertDatagouv({
      numeroDeclarationActivite: "88888888888",
      siren: "111111111",
      siretEtablissementDeclarant: "11111111100006",
      certifications: { actionsDeFormationParApprentissage: true },
    });

    let source = createSource("datagouv");

    let organismes = await source.loadSirets();

    assert.strictEqual(organismes.length, 1);
    assert.deepStrictEqual(organismes[0], "11111111100006");
  });
});
