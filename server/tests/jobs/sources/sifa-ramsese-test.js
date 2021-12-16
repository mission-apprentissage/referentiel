const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertEtablissement } = require("../../utils/fakeData");

describe("sifa-ramases", () => {
  it("Vérifie qu'on peut collecter l'uai", async () => {
    await insertEtablissement({
      siret: "11111111100006",
    });
    let source = createSource("sifa-ramsese", {
      input: createStream(`"numero_uai";"numero_siren_siret_uai"
"0111111Y";"11111111100006"`),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("etablissements").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["sifa-ramsese"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      ["sifa-ramsese"]: {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
