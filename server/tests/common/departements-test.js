const assert = require("assert");
const { findDepartementByInsee } = require("../../src/common/departements");

describe("regions", () => {
  it("Permet de trouver un département à partir d'un code postal", () => {
    assert.deepStrictEqual(findDepartementByInsee("75056").nom, "Paris");
    assert.deepStrictEqual(findDepartementByInsee("2B033").nom, "Haute-Corse");
    assert.deepStrictEqual(findDepartementByInsee("97209").nom, "Martinique");
    assert.deepStrictEqual(findDepartementByInsee("UNKNOWN"), null);
  });
});
