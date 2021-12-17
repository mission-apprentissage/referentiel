const assert = require("assert");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertOrganisme } = require("../../utils/fakeData");
const { dbCollection } = require("../../../src/common/db/mongodb");

describe("datagouv", () => {
  it("Vérifie qu'on peut collecter des informations de la liste publique des organismes de formation", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    await insertOrganisme({ siret: "11111111100007" });
    await insertOrganisme({ siret: "22222222200002" });
    let source = createSource("datagouv", {
      input: createStream(
        `numeroDeclarationActivite;siren;siretEtablissementDeclarant;certifications.actionsDeFormationParApprentissage
"88888888888";"111111111";"00006";"true"`
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
        ignored: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie que peut charger en mémoire la liste des CFA", async () => {
    let input = createStream(
      `numeroDeclarationActivite;siren;siretEtablissementDeclarant;certifications.actionsDeFormationParApprentissage
"88888888888";"111111111";"00006";"true"`
    );

    let source = createSource("datagouv", { input });

    let organismes = await source.loadOrganismeDeFormations({ input });

    assert.strictEqual(organismes.length, 1);
    assert.deepStrictEqual(organismes[0], "11111111100006");
  });
});
