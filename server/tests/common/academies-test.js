const assert = require("assert");
const {
  findAcademieByUai,
  findAcademieByName,
  findAcademieByCodeInsee,
  findAcademieByCode,
} = require("../../src/common/academies");

describe("academies", () => {
  it("Permet de trouver une académie à partir d'un UAI", () => {
    assert.deepStrictEqual(findAcademieByUai("0751234J").nom, "Paris");
    assert.deepStrictEqual(findAcademieByUai("6200001G").nom, "Corse");
    assert.deepStrictEqual(findAcademieByUai("9871234J").nom, "Polynésie Française");
    assert.deepStrictEqual(findAcademieByUai("UNKNOWN"), null);
  });

  it("Permet de trouver une académie à partir d'un code", () => {
    assert.deepStrictEqual(findAcademieByCode("20").nom, "Amiens");
  });

  it("Permet de trouver une académie à partir d'un code INSEE", () => {
    assert.deepStrictEqual(findAcademieByCodeInsee("97416").nom, "La Réunion");
    assert.deepStrictEqual(findAcademieByCodeInsee("2B042").nom, "Corse");
    assert.deepStrictEqual(findAcademieByCodeInsee("75001").nom, "Paris");
  });

  it("Permet de trouver une académie à partir de son nom", () => {
    assert.deepStrictEqual(findAcademieByName("Paris").code, "01");
  });
});
