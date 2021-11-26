const assert = require("assert");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertEtablissement } = require("../../utils/fakeData");
const { dbCollection } = require("../../../src/common/db/mongodb");

describe("maf", () => {
  it("Vérifie qu'on peut collecter des informations de la liste publique des organismes de formation", async () => {
    await insertEtablissement({ siret: "11111111100006" });
    await insertEtablissement({ siret: "11111111100007" });
    let source = createSource("maf", {
      input: createStream(
        `siren;num_etablissement;num_da;cfa
"111111111";"00006";"88888888888";"Oui"`
      ),
    });

    let stats = await collectSources(source);

    let docs = await dbCollection("etablissements").find({}, { _id: 0 }).toArray();
    assert.deepStrictEqual(docs[0].numero_declaration_activite, "88888888888");
    assert.deepStrictEqual(docs[1].numero_declaration_activite, "88888888888");
    assert.deepStrictEqual(stats, {
      maf: {
        total: 1,
        updated: 2,
        ignored: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut ignore les organismes que ne sont pas des CFA", async () => {
    await insertEtablissement({ siret: "11111111100006" });
    let source = createSource("maf", {
      input: createStream(
        `siren;num_etablissement;num_da;cfa
"111111111";"00006";"88888888888";"Non"`
      ),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("etablissements").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.ok(!found.numero_declaration_activite);
    assert.deepStrictEqual(stats, {
      maf: {
        total: 0,
        updated: 0,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
