const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const { importOrganismesForTest } = require("../../utils/testUtils");
const collectSources = require("../../../src/jobs/collectSources");
const importOrganismes = require("../../../src/jobs/importOrganismes");
const { mockCatalogueApi } = require("../../utils/apiMocks");

describe("catalogue-etablissements", () => {
  it("Vérifie que peut convertir la source en référentiel", async () => {
    mockCatalogueApi((client, responses) => {
      client
        .get("/entity/etablissements.ndjson")
        .query(() => true)
        .reply(200, responses.etablissements('{"siret":"11111111100006","uai":"0111111Y"}\n'));
    });

    let source = createSource("catalogue-etablissements");

    let stats = await importOrganismes(source);

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.siret, "11111111100006");
    assert.deepStrictEqual(stats, {
      "catalogue-etablissements": {
        created: 1,
        failed: 0,
        invalid: 0,
        total: 1,
        updated: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des informations relatives aux établissements du catalogue", async () => {
    await importOrganismesForTest();
    mockCatalogueApi((client, responses) => {
      client
        .get("/entity/etablissements.ndjson")
        .query(() => true)
        .reply(200, responses.etablissements('{"siret":"11111111100006","uai":"0111111Y"}\n'));
    });

    let source = createSource("catalogue-etablissements");

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["catalogue-etablissements"],
        uai: "0111111Y",
        valide: true,
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
