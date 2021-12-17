const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertOrganisme } = require("../../utils/fakeData");

describe("depp", () => {
  it("Vérifie qu'on peut collecter l'uai formateur et les informations de conformité", async () => {
    await insertOrganisme({
      siret: "11111111111111",
    });
    let source = createSource("depp", {
      input: createStream(`"numero_uai";"numero_siren_siret_uai"
"0011058V";"11111111111111"`),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111111111" }, { _id: 0 });
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["depp"],
        uai: "0011058V",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      depp: {
        total: 1,
        updated: 1,
        failed: 0,
        ignored: 0,
      },
    });
  });
});
