const assert = require("assert");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const importOrganismes = require("../../../src/jobs/importOrganismes");
const { createStream } = require("../../utils/testUtils");
const { insertOrganisme } = require("../../utils/fakeData");
const { dbCollection } = require("../../../src/common/db/mongodb");

describe("datagouv", () => {
  it("Vérifie que peut convertir la source en référentiel", async () => {
    let input = createStream(
      `numeroDeclarationActivite;siren;siretEtablissementDeclarant;certifications.actionsDeFormationParApprentissage
"88888888888";"111111111";"11111111100006";"true"
"88888888889";"111111111";"11111111100007";"false"`
    );
    let source = createSource("datagouv", { input });

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
    await insertOrganisme({ siret: "11111111100006" });
    await insertOrganisme({ siret: "11111111100007" });
    await insertOrganisme({ siret: "22222222200002" });
    let source = createSource("datagouv", {
      input: createStream(
        `numeroDeclarationActivite;siren;siretEtablissementDeclarant;certifications.actionsDeFormationParApprentissage
"88888888888";"111111111";"11111111100006";"true"`
      ),
    });

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
    let input = createStream(
      `numeroDeclarationActivite;siren;siretEtablissementDeclarant;certifications.actionsDeFormationParApprentissage
"88888888888";"111111111";"11111111100006";"true"`
    );
    let source = createSource("datagouv", { input });

    let organismes = await source.loadOrganismeDeFormations({ input });

    assert.strictEqual(organismes.length, 1);
    assert.deepStrictEqual(organismes[0], "11111111100006");
  });
});
