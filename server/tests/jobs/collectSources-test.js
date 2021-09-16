const assert = require("assert");
const { omit } = require("lodash");
const { oleoduc, transformData } = require("oleoduc");
const { Readable } = require("stream");
const { dbCollection } = require("../../src/common/db/mongodb");
const { insertAnnuaire } = require("../utils/fakeData");
const collectSources = require("../../src/jobs/tasks/collectSources");

describe(__filename, () => {
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

  it("Vérifie qu'on peut collecter un uai", async () => {
    try {
      await insertAnnuaire({ siret: "11111111100006" });
    } catch (e) {
      console.log(JSON.stringify(e.errInfo.details, null, 2));
      throw e;
    }
    let source = createTestSource([
      {
        selector: "11111111100006",
        uais: ["0111111Y"],
      },
    ]);

    let stats = await collectSources(source);

    let found = await dbCollection("annuaire").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.uais, [
      {
        sources: ["dummy"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on teste la validité d'un UAI", async () => {
    await insertAnnuaire({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        uais: ["093XXXT"],
      },
    ]);

    let stats = await collectSources(source);

    let found = await dbCollection("annuaire").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.uais[0], {
      sources: ["dummy"],
      uai: "093XXXT",
      valide: false,
    });
    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on ignore un uai quand il existe déjà dans la liste des uais", async () => {
    let source = createTestSource([
      {
        selector: "11111111100006",
        uais: ["0111111Y"],
      },
    ]);
    await insertAnnuaire({
      uai: "0011058V",
      siret: "11111111100006",
      uais: [
        {
          sources: ["dummy"],
          uai: "0111111Y",
          valide: true,
        },
      ],
    });

    let stats = await collectSources(source);

    let found = await dbCollection("annuaire").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.uais, [
      {
        sources: ["dummy"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        updated: 0,
        ignored: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on fusionne un uai déjà collecté part une autre source", async () => {
    await insertAnnuaire({
      siret: "11111111100006",
      uais: [
        {
          sources: ["other"],
          uai: "0111111Y",
          valide: true,
        },
      ],
    });
    let source = createTestSource([
      {
        selector: "11111111100006",
        uais: ["0111111Y"],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("annuaire").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.uais, found.uais, [
      {
        sources: ["other", "dummy"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
  });

  it("Vérifie qu'on ignore un uai avec une donnée invalide", async () => {
    await insertAnnuaire({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        uais: ["", null, "NULL"],
      },
    ]);

    let stats = await collectSources(source);

    let found = await dbCollection("annuaire").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.uais, []);
    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        updated: 0,
        ignored: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on ignore un établissement quand il est inconnu", async () => {
    await insertAnnuaire({ siret: "222222222000022" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        uais: ["", null, "NULL"],
      },
    ]);

    let stats = await collectSources(source);

    let count = await dbCollection("annuaire").countDocuments({ siret: "11111111100006" });
    assert.strictEqual(count, 0);
    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        updated: 0,
        ignored: 1,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on stocke une erreur survenue durant une collecte", async () => {
    await insertAnnuaire({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        anomalies: [new Error("Erreur")],
      },
    ]);

    let stats = await collectSources(source);

    let found = await dbCollection("annuaire").findOne({ siret: "11111111100006" }, { _id: 0 });
    let errors = found._meta.anomalies;
    assert.ok(errors[0].date);
    assert.deepStrictEqual(omit(errors[0], ["date"]), {
      details: "Erreur",
      source: "dummy",
      code: "erreur",
      job: "collect",
    });
    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        updated: 0,
        ignored: 0,
        failed: 1,
      },
    });
  });

  it("Vérifie qu'on stocke une erreur survenue technique", async () => {
    await insertAnnuaire({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        uais: null,
      },
    ]);

    let stats = await collectSources(source);

    let found = await dbCollection("annuaire").findOne({ siret: "11111111100006" }, { _id: 0 });
    let errors = found._meta.anomalies;
    assert.ok(errors[0].date);
    assert.deepStrictEqual(omit(errors[0], ["date"]), {
      details: "Cannot read property 'filter' of null",
      source: "dummy",
      code: "erreur",
      job: "collect",
    });
    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        updated: 0,
        ignored: 0,
        failed: 1,
      },
    });
  });

  it("Vérifie qu'on ignore un selecteur vide", async () => {
    await insertAnnuaire({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: {},
        uais: [],
      },
    ]);

    let stats = await collectSources(source);

    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        ignored: 1,
        failed: 0,
        updated: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des contacts", async () => {
    await insertAnnuaire({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        contacts: [{ email: "robert@formation.fr" }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("annuaire").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.contacts, [
      {
        email: "robert@formation.fr",
        sources: ["dummy"],
        confirmé: false,
      },
    ]);
  });

  it("Vérifie qu'on peut fusionner un contact déjà collecté", async () => {
    await insertAnnuaire({
      siret: "11111111100006",
      contacts: [
        {
          email: "jacques@dupont.fr",
          sources: ["other"],
          confirmé: false,
        },
      ],
    });
    let source = createTestSource([
      {
        selector: "11111111100006",
        contacts: [{ email: "jacques@dupont.fr", confirmé: false }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("annuaire").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.contacts[0].sources, ["other", "dummy"]);
  });

  it("Vérifie qu'on ne duplique pas les contacts", async () => {
    await insertAnnuaire({
      siret: "11111111100006",
      contacts: [
        {
          email: "jacques@dupont.fr",
          sources: ["dummy"],
          confirmé: false,
        },
      ],
    });
    let source = createTestSource([
      {
        selector: "11111111100006",
        relations: [{ siret: "22222222200002", annuaire: false, label: "test", type: "gestionnaire" }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("annuaire").findOne({}, { _id: 0 });
    assert.strictEqual(found.contacts.length, 1);
  });

  it("Vérifie qu'on peut ajouter des meta à un contact", async () => {
    await insertAnnuaire({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        contacts: [{ email: "jacques@dupont.fr", confirmé: false, _extra: { aSource: "some-data-to-store" } }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("annuaire").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.contacts[0]._extra, { dummy: { aSource: "some-data-to-store" } });
  });

  it("Vérifie qu'on peut collecter des relations", async () => {
    await insertAnnuaire({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        relations: [{ siret: "22222222200002", annuaire: false, label: "Centre de formation", type: "gestionnaire" }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("annuaire").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.relations, [
      {
        siret: "22222222200002",
        annuaire: false,
        label: "Centre de formation",
        type: "gestionnaire",
        sources: ["dummy"],
      },
    ]);
  });

  it("Vérifie qu'on peut fusionner une relation déjà collectée", async () => {
    await insertAnnuaire({
      siret: "11111111100006",
      relations: [
        {
          siret: "22222222200002",
          annuaire: false,
          label: "Centre de formation",
          type: "gestionnaire",
          sources: ["other"],
        },
      ],
    });
    let source = createTestSource([
      {
        selector: "11111111100006",
        relations: [{ siret: "22222222200002", label: "Centre de formation", type: "gestionnaire" }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("annuaire").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.relations[0].sources, ["other", "dummy"]);
  });

  it("Vérifie qu'on ne duplique pas les relations", async () => {
    await insertAnnuaire({
      siret: "11111111100006",
      relations: [
        {
          siret: "22222222200002",
          annuaire: false,
          label: "test",
          type: "gestionnaire",
          sources: ["dummy"],
        },
      ],
    });
    let source = createTestSource([
      {
        selector: "11111111100006",
        relations: [{ siret: "22222222200002", annuaire: false, label: "test", type: "gestionnaire" }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("annuaire").findOne({}, { _id: 0 });
    assert.strictEqual(found.relations.length, 1);
    assert.strictEqual(found.relations[0].siret, "22222222200002");
    assert.strictEqual(found.relations[0].type, "gestionnaire");
  });

  it("Vérifie qu'on peut détecter des relations entre établissements de l'annuaire", async () => {
    await insertAnnuaire({ siret: "11111111100006" });
    await insertAnnuaire({ siret: "22222222200002", raison_sociale: "Centre de formation" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        relations: [{ siret: "22222222200002", label: "test" }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("annuaire").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.relations, [
      {
        siret: "22222222200002",
        label: "test",
        annuaire: true,
        sources: ["dummy"],
      },
    ]);
  });

  it("Vérifie qu'on peut collecter des reseaux", async () => {
    await insertAnnuaire({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        reseaux: ["test"],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("annuaire").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["test"]);
  });

  it("Vérifie qu'on ne duplique pas les reseaux", async () => {
    await insertAnnuaire({
      siret: "11111111100006",
      reseaux: ["test"],
    });
    let source = createTestSource([
      {
        selector: "11111111100006",
        reseaux: ["test"],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("annuaire").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["test"]);
  });

  it("Vérifie qu'on peut filter par siret", async () => {
    await insertAnnuaire({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        reseaux: ["test"],
      },
    ]);

    let stats = await collectSources(source, { filters: { siret: "33333333300008" } });

    assert.deepStrictEqual(stats, {
      dummy: {
        total: 0,
        updated: 0,
        ignored: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter en se basant sur l'uai", async () => {
    await insertAnnuaire({
      uai: "0011073X",
      siret: "11111111100006",
    });
    let source = createTestSource([
      {
        selector: "0011073X",
        reseaux: ["test"],
      },
    ]);

    let stats = await collectSources(source);

    let found = await dbCollection("annuaire").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["test"]);
    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });
});
