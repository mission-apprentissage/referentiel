const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertOrganisme } = require("../../utils/fakeData");
const importOrganismes = require("../../../src/jobs/importOrganismes");

describe("sifa-ramsese", () => {
  it("Vérifie que peut convertir la source en référentiel", async () => {
    const source = createSource("sifa-ramsese", {
      input: createStream(`"numero_uai";"numero_siren_siret_uai"
"0111111Y";"11111111100006"`),
    });

    const stats = await importOrganismes(source);

    const found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.siret, "11111111100006");
    assert.deepStrictEqual(stats, {
      "sifa-ramsese": {
        created: 1,
        failed: 0,
        invalid: 0,
        total: 1,
        updated: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter l'uai", async () => {
    await insertOrganisme({
      siret: "11111111100006",
    });
    const source = createSource("sifa-ramsese", {
      input: createStream(`"numero_uai";"numero_siren_siret_uai"
"0111111Y";"11111111100006"`),
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["sifa-ramsese"],
        uai: "0111111Y",
      },
    ]);
    assert.deepStrictEqual(stats, {
      ["sifa-ramsese"]: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });
});
