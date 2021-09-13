const assert = require("assert");
const { insertAcce } = require("./utils/fakeData");
const patchAcce = require("../src/jobs/acce/patchAcce");
const { Readable } = require("stream");
const { oleoduc } = require("oleoduc");
const { getCollection } = require("../src/common/db/mongodb");

function createTestSource(array) {
  let name = "dummy";
  return {
    name,
    stream() {
      return oleoduc(Readable.from(array), { promisify: false });
    },
  };
}

describe(__filename, () => {
  it("Vérifie qu'on peut patcher un etablissement en lui ajoutant un siret", async () => {
    await insertAcce({
      uai: "0111111Y",
    });

    let stats = await patchAcce({
      sifaRamsese: createTestSource([{ siret: "11111111100006", uai: "0111111Y" }]),
    });

    let found = await getCollection("acce").findOne();
    assert.deepStrictEqual(found.siret, "11111111100006");
    assert.deepStrictEqual(stats, {
      total: 1,
      updated: 1,
      failed: 0,
      rattachements: {
        updated: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut patcher un rattachement en lui ajoutant un siret", async () => {
    await insertAcce({
      uai: "0111111Y",
      rattachements: {
        fille: [
          {
            uai: "0222222W",
            sigle: "FORMATION",
            patronyme: "FILLE FORMATION",
            nature: "Section d'enseignement général et professionnel adapté",
            commune: "Clermont-Ferrand",
          },
        ],
        mere: [
          {
            uai: "0333333U",
            sigle: "FORMATION",
            patronyme: "MERE FORMATION",
            nature: "Section d'enseignement général et professionnel adapté",
            commune: "Clermont-Ferrand",
          },
        ],
      },
    });

    let stats = await patchAcce({
      sifaRamsese: createTestSource([
        { siret: "11111111100006", uai: "0111111Y" },
        { siret: "22222222200002", uai: "0222222W" },
        { siret: "33333333300003", uai: "0333333U" },
      ]),
    });

    let found = await getCollection("acce").findOne();
    assert.deepStrictEqual(found.rattachements.fille[0].siret, "22222222200002");
    assert.deepStrictEqual(found.rattachements.mere[0].siret, "33333333300003");
    assert.deepStrictEqual(stats, {
      total: 3,
      updated: 1,
      failed: 0,
      rattachements: {
        updated: 2,
        failed: 0,
      },
    });
  });
});
