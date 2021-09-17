const assert = require("assert");
const { omit } = require("lodash");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/tasks/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertEtablissement } = require("../../utils/fakeData");

describe(__filename, () => {
  it("Vérifie qu'on peut collecter des relations pour le fichier ideo2 de l'ONISEP", async () => {
    await insertEtablissement({ siret: "11111111100006" });
    await insertEtablissement({ siret: "22222222200002" });
    let source = createSource("ideo2", {
      input: createStream(
        `"UAI_gestionnaire";"SIRET_gestionnaire";"SIRET_lieu_enseignement";"UAI_lieu_enseignement"
"0111111Y";"11111111100006";"22222222200002";"0011073X"`
      ),
    });

    await collectSources(source);

    let found = await dbCollection("etablissements").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(omit(found.relations[0], ["label"]), {
      siret: "22222222200002",
      annuaire: true,
      type: "formateur",
      sources: ["ideo2"],
    });
    found = await dbCollection("etablissements").findOne({ siret: "22222222200002" }, { _id: 0 });
    assert.deepStrictEqual(omit(found.relations[0], ["label"]), {
      siret: "11111111100006",
      annuaire: true,
      type: "gestionnaire",
      sources: ["ideo2"],
    });
  });
});
