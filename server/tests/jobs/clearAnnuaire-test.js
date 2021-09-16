const assert = require("assert");
const { getCollection } = require("../../src/common/db/mongodb");
const cleanAll = require("../../src/jobs/clear");
const { insertAnnuaire } = require("../utils/fakeData");

describe(__filename, () => {
  it("Vérifie qu'on peut supprimer un annuaire", async () => {
    await insertAnnuaire();

    let stats = await cleanAll();

    let count = await getCollection("annuaire").countDocuments();
    assert.strictEqual(count, 0);
    assert.deepStrictEqual(stats, {
      deleted: 1,
    });
  });
});
