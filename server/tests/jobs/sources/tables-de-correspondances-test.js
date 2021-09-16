const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const { importReferentiel } = require("../../utils/testUtils");
const collectSources = require("../../../src/jobs/tasks/collectSources");
const { mockTcoApi } = require("../../utils/apiMocks");

describe(__filename, () => {
  it("Vérifie qu'on peut collecter des informations relatives aux établissements du catalogue", async () => {
    await importReferentiel();
    mockTcoApi((client, responses) => {
      client
        .get("/entity/etablissements.ndjson")
        .query(() => true)
        .reply(200, responses.etablissements('{"siret":"11111111100006","uai":"0111111Y"}\n'));
    });

    let source = createSource("tables-de-correspondances");

    let stats = await collectSources(source);

    let found = await dbCollection("annuaire").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.uais, [
      {
        sources: ["tables-de-correspondances"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      "tables-de-correspondances": {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
