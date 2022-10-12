const assert = require("assert");
const { omit } = require("lodash");
const { Readable } = require("stream");
const { dbCollection } = require("../../src/common/db/mongodb");
const importOrganismes = require("../../src/jobs/importOrganismes");
const { compose, transformData } = require("oleoduc");
const { insertOrganisme } = require("../utils/fakeData");

function createTestSource(array, options = {}) {
  const name = options.name || "dummy";
  return {
    name,
    referentiel() {
      return compose(
        Readable.from(array),
        transformData((d) => ({ from: name, ...d }))
      );
    },
  };
}

describe("importOrganismes", () => {
  it("Vérifie qu'on peut importer un référentiel", async () => {
    const source = createTestSource([{ siret: "11111111100006" }]);

    const results = await importOrganismes(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { projection: { _id: 0 } });
    assert.deepStrictEqual(omit(found, ["_meta"]), {
      siret: "11111111100006",
      referentiels: ["dummy"],
      nature: "inconnue",
      uai_potentiels: [],
      reseaux: [],
      contacts: [],
      relations: [],
      lieux_de_formation: [],
      diplomes: [],
      certifications: [],
    });
    assert.ok(found._meta.date_import);
    assert.ok(found._meta.date_dernier_import);
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

  it("Vérifie qu'on peut mettre à jour un organisme", async () => {
    const source = createTestSource([{ siret: "11111111100006" }]);
    await insertOrganisme({ siret: "11111111100006", referentiels: ["test"] });

    const results = await importOrganismes(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { projection: { _id: 0 } });
    assert.deepStrictEqual(found.referentiels, ["test", "dummy"]);
    assert.ok(found._meta.date_dernier_import);
    assert.deepStrictEqual(results, {
      dummy: {
        total: 1,
        created: 0,
        updated: 1,
        invalid: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on ignore les organismes en double", async () => {
    const source = createTestSource([{ siret: "11111111100006" }, { siret: "11111111100006" }]);

    const results = await importOrganismes(source);

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
    const source = createTestSource([{ siret: "" }]);

    const results = await importOrganismes(source);

    const count = await dbCollection("organismes").countDocuments({ siret: "11111111100006" });
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
    const source = createTestSource([{ siret: "" }]);

    const results = await importOrganismes(source);

    const count = await dbCollection("organismes").countDocuments({ siret: "7894766" });
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
    const source = createTestSource([{ siret: "11111111100006" }], { name: 666 });

    const results = await importOrganismes(source);

    assert.deepStrictEqual(results, {
      666: {
        total: 1,
        created: 0,
        updated: 0,
        invalid: 0,
        failed: 1,
      },
    });
  });
});
