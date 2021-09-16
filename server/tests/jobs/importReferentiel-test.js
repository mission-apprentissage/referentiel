const assert = require("assert");
const { omit } = require("lodash");
const { Readable } = require("stream");
const { getCollection } = require("../../src/common/db/mongodb");
const importReferentiel = require("../../src/jobs/importReferentiel");

function createTestReferentiel(array) {
  return {
    name: "test",
    stream() {
      return Readable.from(array.map((item) => ({ ...item, from: "test" })));
    },
  };
}

describe(__filename, () => {
  it("Vérifie qu'on peut initialiser un annuaire à partir d'un référentiel", async () => {
    let referentiel = createTestReferentiel([{ siret: "11111111100006" }]);

    let results = await importReferentiel(referentiel);

    let found = await getCollection("annuaire").findOne({ siret: "11111111100006" }, { projection: { _id: 0 } });
    assert.deepStrictEqual(omit(found, ["_meta"]), {
      siret: "11111111100006",
      referentiels: ["test"],
      uais: [],
      reseaux: [],
      contacts: [],
      relations: [],
      lieux_de_formation: [],
      diplomes: [],
      certifications: [],
    });
    assert.ok(found._meta.created_at);
    assert.deepStrictEqual(found._meta.anomalies, []);
    assert.deepStrictEqual(results, {
      total: 1,
      created: 1,
      updated: 0,
      failed: 0,
    });
  });

  it("Vérifie qu'on ignore les établissements en double", async () => {
    let referentiel = createTestReferentiel([{ siret: "11111111100006" }, { siret: "11111111100006" }]);

    let results = await importReferentiel(referentiel);

    await getCollection("annuaire").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(results, {
      total: 2,
      created: 1,
      updated: 0,
      failed: 0,
    });
  });

  it("Vérifie qu'on peut ignorer un établissement avec un siret vide", async () => {
    let referentiel = createTestReferentiel([
      {
        siret: "",
      },
    ]);

    let results = await importReferentiel(referentiel);

    let count = await getCollection("annuaire").countDocuments({ siret: "11111111100006" });
    assert.strictEqual(count, 0);
    assert.deepStrictEqual(results, {
      total: 1,
      created: 0,
      updated: 0,
      failed: 1,
    });
  });
});
