const assert = require("assert");
const { Readable } = require("stream");
const { createSource } = require("../../../src/jobs/sources/sources");
const importOrganismes = require("../../../src/jobs/importOrganismes");
const collectSources = require("../../../src/jobs/collectSources");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { insertOrganisme } = require("../../utils/fakeData");

describe("mna", () => {
  it("Vérifie qu'on peut importer des organismes", async () => {
    const source = createSource("mna", { input: Readable.from([{ siret: "11111111100006" }]) });

    let stats = await importOrganismes(source);

    let count = await dbCollection("organismes").count({ siret: "11111111100006" });
    assert.strictEqual(count, 1);
    assert.deepStrictEqual(stats, {
      mna: {
        total: 1,
        created: 1,
        updated: 0,
        invalid: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des informations", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    const source = createSource("mna", { input: Readable.from([{ siret: "11111111100006", uai: "0751234J" }]) });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found.uai, "0751234J");
    assert.deepStrictEqual(stats, {
      mna: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });
});
