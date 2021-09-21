const assert = require("assert");
const { dbCollection } = require("../../src/common/db/mongodb");
const cleanAll = require("../../src/jobs/clearAll");
const { insertEtablissement, insertCFD } = require("../utils/fakeData");

describe(__filename, () => {
  it("Vérifie qu'on peut supprimer les établissements", async () => {
    await insertEtablissement();
    await insertCFD();

    let stats = await cleanAll();

    let count = await dbCollection("etablissements").countDocuments();
    assert.strictEqual(count, 0);
    assert.deepStrictEqual(stats, {
      etablissements: 1,
      cfd: 1,
    });
  });
});
