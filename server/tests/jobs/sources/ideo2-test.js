const assert = require("assert");
const { omit } = require("lodash");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertOrganisme, insertDatagouv } = require("../../utils/fakeData");

describe("ideo2", () => {
  it("Vérifie qu'on peut collecter des relations pour le fichier ideo2 de l'ONISEP", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    await insertOrganisme({ siret: "22222222200002" });
    await insertDatagouv({ siren: "111111111", siretEtablissementDeclarant: "11111111100006" });
    await insertDatagouv({ siren: "222222222", siretEtablissementDeclarant: "22222222200002" });
    const source = createSource("ideo2", {
      input: createStream(
        `"UAI_gestionnaire";"SIRET_gestionnaire";"SIRET_lieu_enseignement";"UAI_lieu_enseignement"
"0111111Y";"11111111100006";"22222222200002";"0011073X"`
      ),
    });

    await collectSources(source);

    let found = await dbCollection("organismes").findOne(
      { siret: "11111111100006" },
      { projection: { "relations.date_collecte": 0 } }
    );
    assert.deepStrictEqual(omit(found.relations[0], ["label"]), {
      siret: "22222222200002",
      referentiel: true,
      type: "responsable->formateur",
      sources: ["ideo2"],
    });
    found = await dbCollection("organismes").findOne(
      { siret: "22222222200002" },
      { projection: { "relations.date_collecte": 0 } }
    );
    assert.deepStrictEqual(omit(found.relations[0], ["label"]), {
      siret: "11111111100006",
      referentiel: true,
      type: "formateur->responsable",
      sources: ["ideo2"],
    });
  });
});
