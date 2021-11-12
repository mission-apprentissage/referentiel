const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const { importEtablissements } = require("../../utils/testUtils");
const collectSources = require("../../../src/jobs/collectSources");
const { mockCatalogueApi } = require("../../utils/apiMocks");

describe("catalogue-etablissements", () => {
  it("Vérifie qu'on peut collecter des informations relatives aux établissements du catalogue", async () => {
    await importEtablissements();
    mockCatalogueApi((client, responses) => {
      client
        .get("/entity/etablissements.ndjson")
        .query(() => true)
        .reply(200, responses.etablissements('{"siret":"11111111100006","uai":"0111111Y"}\n'));
    });

    let source = createSource("catalogue-etablissements");

    let stats = await collectSources(source);

    let found = await dbCollection("etablissements").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.uais, [
      {
        sources: ["catalogue-etablissements"],
        uai: "0111111Y",
        valide: true,
        confirmé: false,
      },
    ]);
    assert.deepStrictEqual(stats, {
      "catalogue-etablissements": {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
