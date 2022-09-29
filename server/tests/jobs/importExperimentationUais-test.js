const assert = require("assert");
const { createStream } = require("../utils/testUtils");
const importExperimentationUais = require("../../src/jobs/experimentation/importExperimentationUais.js");
const { dbCollection } = require("../../src/common/db/mongodb");
const { insertOrganisme } = require("../utils/fakeData");

const getCsvStream = (content) => {
  return createStream(
    content ||
      `siret;uai
11111111100006;0751234J
`
  );
};

describe("importExperimentationUais", () => {
  it("Vérifie qu'on peut ajouter des modifications", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    const stats = await importExperimentationUais(
      getCsvStream(`siret;uai
11111111100006;0751234J
`)
    );

    const found = await dbCollection("modifications").findOne({ siret: "11111111100006" });
    assert.ok(found.date);
    assert.strictEqual(found.siret, "11111111100006");
    assert.strictEqual(found.auteur, "experimentation");
    assert.strictEqual(found.original.uai, undefined);
    assert.deepStrictEqual(found.changements, { uai: "0751234J" });
    assert.deepStrictEqual(stats, {
      total: 1,
      inserted: 1,
      invalid: 0,
      failed: 0,
    });
  });

  it("Vérifie qu'on ignore les lignes invalides", async () => {
    const stats = await importExperimentationUais(
      getCsvStream(`siret;uai
11111111100006;
;INVALID
`)
    );

    assert.deepStrictEqual(stats, {
      total: 2,
      inserted: 0,
      invalid: 2,
      failed: 0,
    });
  });
});
