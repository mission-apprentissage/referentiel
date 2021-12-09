const assert = require("assert");
const { createStream } = require("../utils/testUtils");
const addModifications = require("../../src/jobs/addModifications");
const { dbCollection } = require("../../src/common/db/mongodb");

let getCsvStream = (content) => {
  return createStream(
    content ||
      `siret;uai
11111111100006;0751234J
`
  );
};

describe("addModifications", () => {
  it("Vérifie qu'on peut ajouter des modifications", async () => {
    let stats = await addModifications(
      getCsvStream(`siret;uai
11111111100006;0751234J
`)
    );

    const found = await dbCollection("modifications").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.ok(found._meta.created_at);
    assert.deepStrictEqual(found.siret, "11111111100006");
    assert.deepStrictEqual(found.uai, "0751234J");
    assert.deepStrictEqual(stats, {
      total: 1,
      inserted: 1,
      invalid: 0,
      failed: 0,
    });
  });

  it("Vérifie qu'on ignore les lignes invalides", async () => {
    let stats = await addModifications(
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
