const assert = require("assert");
const { dbCollection } = require("../../src/common/db/mongodb");
const cleanAll = require("../../src/jobs/clearAll");
const { insertEtablissement } = require("../utils/fakeData");

describe(__filename, () => {
  it("Vérifie qu'on peut supprimer les établissements", async () => {
    await insertEtablissement();

    let stats = await cleanAll();

    let count = await dbCollection("etablissements").countDocuments();
    assert.strictEqual(count, 0);
    assert.deepStrictEqual(stats, {
      deleted: 1,
    });
  });
});
