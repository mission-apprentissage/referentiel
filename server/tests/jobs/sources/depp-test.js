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
    const source = createSource("depp", {
      input: createStream(`"numero_uai";"numero_siren_siret_uai"
"0011058V";"11111111111111"`),
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111111111" }, { _id: 0 });
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["depp"],
        uai: "0011058V",
      },
    ]);
    assert.deepStrictEqual(stats, {
      depp: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });
});
