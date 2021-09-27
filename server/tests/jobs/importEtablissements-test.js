const assert = require("assert");
const { omit } = require("lodash");
const { Readable } = require("stream");
const { dbCollection } = require("../../src/common/db/mongodb");
const importReferentiel = require("../../src/jobs/importEtablissements");
const { oleoduc, transformData } = require("oleoduc");

function createTestSource(array) {
  let name = "dummy";
  return {
    name,
    stream() {
      return oleoduc(
        Readable.from(array),
        transformData((d) => ({ from: name, ...d })),
        { promisify: false }
      );
    },
  };
}

describe("importEtablissement", () => {
  it("Vérifie qu'on peut importer un référentiel", async () => {
    let source = createTestSource([{ selector: "11111111100006" }]);

    let results = await importReferentiel(source);

    let found = await dbCollection("etablissements").findOne({ siret: "11111111100006" }, { projection: { _id: 0 } });
    assert.deepStrictEqual(omit(found, ["_meta"]), {
      siret: "11111111100006",
      referentiels: ["dummy"],
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
    let source = createTestSource([{ selector: "11111111100006" }, { selector: "11111111100006" }]);

    let results = await importReferentiel(source);

    await dbCollection("etablissements").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(results, {
      total: 2,
      created: 1,
      updated: 0,
      failed: 0,
    });
  });

  it("Vérifie qu'on ignore un établissement avec un siret vide", async () => {
    let source = createTestSource([
      {
        selector: "",
      },
    ]);

    let results = await importReferentiel(source);

    let count = await dbCollection("etablissements").countDocuments({ siret: "11111111100006" });
    assert.strictEqual(count, 0);
    assert.deepStrictEqual(results, {
      total: 1,
      created: 0,
      updated: 0,
      failed: 1,
    });
  });
});
