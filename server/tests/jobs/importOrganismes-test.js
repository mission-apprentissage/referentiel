const assert = require("assert");
const { omit } = require("lodash");
const { Readable } = require("stream");
const { dbCollection } = require("../../src/common/db/mongodb");
const importReferentiel = require("../../src/jobs/importOrganismes");
const { compose, transformData } = require("oleoduc");
const { insertOrganisme } = require("../utils/fakeData");

function createTestSource(array) {
  let name = "dummy";
  return {
    name,
    stream() {
      return compose(
        Readable.from(array),
        transformData((d) => ({ from: name, ...d }))
      );
    },
  };
}

describe("importOrganismes", () => {
  it("Vérifie qu'on peut importer un référentiel", async () => {
    let source = createTestSource([{ selector: "11111111100006" }]);

    let results = await importReferentiel(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { projection: { _id: 0 } });
    assert.deepStrictEqual(omit(found, ["_meta"]), {
      siret: "11111111100006",
      referentiels: ["dummy"],
      uai_potentiels: [],
      reseaux: [],
      statuts: [],
      contacts: [],
      relations: [],
      lieux_de_formation: [],
      diplomes: [],
      certifications: [],
    });
    assert.ok(found._meta.created_at);
    assert.deepStrictEqual(found._meta.anomalies, []);
    assert.deepStrictEqual(results, {
      dummy: {
        total: 1,
        created: 1,
        updated: 0,
        invalid: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on ignore les organismes en double", async () => {
    let source = createTestSource([{ selector: "11111111100006" }, { selector: "11111111100006" }]);

    let results = await importReferentiel(source);

    await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(results, {
      dummy: {
        total: 2,
        created: 1,
        updated: 0,
        invalid: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on ignore un organisme avec un siret vide", async () => {
    let source = createTestSource([
      {
        selector: "",
      },
    ]);

    let results = await importReferentiel(source);

    let count = await dbCollection("organismes").countDocuments({ siret: "11111111100006" });
    assert.strictEqual(count, 0);
    assert.deepStrictEqual(results, {
      dummy: {
        total: 1,
        created: 0,
        updated: 0,
        invalid: 1,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on ignore un organisme avec un siret invalide", async () => {
    let source = createTestSource([
      {
        selector: "",
      },
    ]);

    let results = await importReferentiel(source);

    let count = await dbCollection("organismes").countDocuments({ siret: "7894766" });
    assert.strictEqual(count, 0);
    assert.deepStrictEqual(results, {
      dummy: {
        total: 1,
        created: 0,
        updated: 0,
        invalid: 1,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut supprimer tous les organismes avant l'import", async () => {
    let source = createTestSource([{ selector: "11111111100006" }]);
    await insertOrganisme({ siret: "22222222200002" });

    await importReferentiel(source, { removeAll: true });

    let docs = await dbCollection("organismes").find({}, { siret: 1 }).toArray();
    assert.ok(docs.length, 1);
    assert.strictEqual(docs[0].siret, "11111111100006");
  });
});
