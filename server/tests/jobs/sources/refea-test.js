const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { importOrganismes, createStream } = require("../../utils/testUtils");

describe("refea", () => {
  it("Vérifie qu'on peut collecter des informations du fichier REFEA", async () => {
    await importOrganismes();
    let source = createSource("refea", {
      input: createStream(
        `uai_code_siret;uai_code_educnationale;uai_libelle_educnationale
"11111111100006";"0111111Y";"Centre de formation"`
      ),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["refea"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      refea: {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
