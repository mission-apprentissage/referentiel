const assert = require("assert");
const { omit } = require("lodash");
const { compose, transformData } = require("oleoduc");
const { Readable } = require("stream");
const { dbCollection } = require("../../src/common/db/mongodb");
const { insertOrganisme, insertDatagouv } = require("../utils/fakeData");
const collectSources = require("../../src/jobs/collectSources");

describe("collectSources", () => {
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

  it("Vérifie qu'on peut collecter un uai", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        uai_potentiels: ["0111111Y"],
      },
    ]);

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.uai_potentiels, [
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
        unknown: 0,
        failed: 0,
        anomalies: 0,
      },
    });
  });

  it("Vérifie qu'on teste la validité d'un UAI", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        uai_potentiels: ["093XXXT"],
      },
    ]);

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.uai_potentiels[0], {
      sources: ["dummy"],
      uai: "093XXXT",
      valide: false,
    });
    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        updated: 1,
        unknown: 0,
        failed: 0,
        anomalies: 0,
      },
    });
  });

  it("Vérifie qu'on ignore un uai quand il existe déjà dans la liste des uai_potentiels", async () => {
    let source = createTestSource([
      {
        selector: "11111111100006",
        uai_potentiels: ["0111111Y"],
      },
    ]);
    await insertOrganisme({
      siret: "11111111100006",
      uai_potentiels: [
        {
          sources: ["dummy"],
          uai: "0111111Y",
          valide: true,
        },
      ],
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.uai_potentiels, [
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
        unknown: 0,
        failed: 0,
        anomalies: 0,
      },
    });
  });

  it("Vérifie qu'on fusionne un uai déjà collecté part une autre source", async () => {
    await insertOrganisme({
      siret: "11111111100006",
      uai_potentiels: [
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
        uai_potentiels: ["0111111Y"],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.uai_potentiels, found.uai_potentiels, [
      {
        sources: ["other", "dummy"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
  });

  it("Vérifie qu'on ignore un uai avec une donnée invalide", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        uai_potentiels: ["", null, "NULL"],
      },
    ]);

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.uai_potentiels, []);
    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        updated: 0,
        unknown: 0,
        failed: 0,
        anomalies: 0,
      },
    });
  });

  it("Vérifie qu'on ignore un organisme quand il est inconnu", async () => {
    await insertOrganisme({ siret: "222222222000022" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        uai_potentiels: ["", null, "NULL"],
      },
    ]);

    let stats = await collectSources(source);

    let count = await dbCollection("organismes").countDocuments({ siret: "11111111100006" });
    assert.strictEqual(count, 0);
    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        updated: 0,
        unknown: 1,
        failed: 0,
        anomalies: 0,
      },
    });
  });

  it("Vérifie qu'on stocke une erreur survenue durant une collecte", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        anomalies: [new Error("Une erreur est survenue")],
      },
    ]);

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    let errors = found._meta.anomalies;
    assert.ok(errors[0].date);
    assert.deepStrictEqual(omit(errors[0], ["date"]), {
      key: "Une erreur est survenue",
      sources: ["dummy"],
      type: "erreur",
      details: "Une erreur est survenue",
      job: "collect",
    });
    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        updated: 0,
        unknown: 0,
        failed: 0,
        anomalies: 1,
      },
    });
  });

  it("Vérifie qu'on stocke une erreur technique", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        uai_potentiels: null,
      },
    ]);

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    let errors = found._meta.anomalies;
    assert.ok(errors[0].date);
    assert.deepStrictEqual(omit(errors[0], ["date"]), {
      key: "Cannot read properties of null (reading 'filter')",
      sources: ["dummy"],
      type: "erreur",
      details: "Cannot read properties of null (reading 'filter')",
      job: "collect",
    });
    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        updated: 0,
        unknown: 0,
        failed: 1,
        anomalies: 0,
      },
    });
  });

  it("Vérifie qu'on ne duplique pas les anomalies", async () => {
    await insertOrganisme({
      siret: "11111111100006",
      _meta: {
        anomalies: [
          {
            key: "Une erreur est survenue",
            sources: ["dummy"],
            type: "erreur",
            details: "Une erreur est survenue",
            job: "collect",
            date: new Date(),
          },
        ],
      },
    });
    let source = createTestSource([
      {
        selector: "11111111100006",
        anomalies: [new Error("Une erreur est survenue")],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.strictEqual(found._meta.anomalies.length, 1);
  });

  it("Vérifie qu'on ignore un selecteur vide", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: {},
        uai_potentiels: [],
      },
    ]);

    let stats = await collectSources(source);

    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        unknown: 1,
        failed: 0,
        updated: 0,
        anomalies: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des contacts", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        contacts: [{ email: "robert@formation.fr" }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.contacts, [
      {
        email: "robert@formation.fr",
        sources: ["dummy"],
        confirmé: false,
      },
    ]);
  });

  it("Vérifie qu'on peut fusionner un contact déjà collecté", async () => {
    await insertOrganisme({
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

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.contacts[0].sources, ["other", "dummy"]);
  });

  it("Vérifie qu'on ne duplique pas les contacts", async () => {
    await insertOrganisme({
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
        relations: [{ siret: "22222222200002", referentiel: false, label: "test", type: "formateur->responsable" }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.strictEqual(found.contacts.length, 1);
  });

  it("Vérifie qu'on peut collecter des diplomes", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        diplomes: [{ code: "13531445", type: "cfd", niveau: "135", label: "MASTER" }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.diplomes, [
      {
        code: "13531445",
        type: "cfd",
        niveau: "135",
        label: "MASTER",
        sources: ["dummy"],
      },
    ]);
  });

  it("Vérifie qu'on ne duplique pas les diplomes", async () => {
    await insertOrganisme({
      siret: "11111111100006",
      diplomes: [{ code: "13531445", type: "cfd", niveau: "135", label: "MASTER", sources: ["other"] }],
    });
    let source = createTestSource([
      {
        selector: "11111111100006",
        diplomes: [{ code: "13531445", type: "cfd", niveau: "135", label: "MASTER" }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.strictEqual(found.diplomes.length, 1);
    assert.deepStrictEqual(found.diplomes[0].sources, ["other", "dummy"]);
    assert.strictEqual(found.diplomes[0].type, "cfd");
  });

  it("Vérifie qu'on peut collecter des certifications", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        certifications: [{ code: "RNCP29746", type: "rncp", label: "SOCIOLOGIE" }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.certifications, [
      {
        code: "RNCP29746",
        type: "rncp",
        label: "SOCIOLOGIE",
        sources: ["dummy"],
      },
    ]);
  });

  it("Vérifie qu'on ne duplique pas les certifications", async () => {
    await insertOrganisme({
      siret: "11111111100006",
      certifications: [{ code: "RNCP29746", type: "rncp", label: "SOCIOLOGIE", sources: ["other"] }],
    });
    let source = createTestSource([
      {
        selector: "11111111100006",
        certifications: [{ code: "RNCP29746", type: "rncp", label: "SOCIOLOGIE" }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.strictEqual(found.certifications.length, 1);
    assert.deepStrictEqual(found.certifications[0].sources, ["other", "dummy"]);
  });

  it("Vérifie qu'on peut collecter des relations", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    await insertDatagouv({ siren: "222222222", siretEtablissementDeclarant: "22222222200002" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        relations: [
          {
            siret: "22222222200002",
            referentiel: false,
            label: "Centre de formation",
            type: "formateur->responsable",
          },
        ],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.relations, [
      {
        siret: "22222222200002",
        referentiel: false,
        label: "Centre de formation",
        type: "formateur->responsable",
        sources: ["dummy"],
      },
    ]);
  });

  it("Vérifie qu'on peut collecter des relations (referentiel)", async () => {
    await Promise.all([insertOrganisme({ siret: "11111111100006" }), insertOrganisme({ siret: "22222222200002" })]);
    let source = createTestSource([
      {
        selector: "11111111100006",
        relations: [{ siret: "22222222200002", type: "entreprise", label: "test" }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.strictEqual(found.relations[0].referentiel, true);
  });

  it("Vérifie qu'on ne duplique pas les relations", async () => {
    await insertOrganisme({
      siret: "11111111100006",
      relations: [
        {
          siret: "22222222200002",
          referentiel: false,
          label: "test",
          type: "formateur->responsable",
          sources: ["other"],
        },
      ],
    });
    await insertDatagouv({ siren: "222222222", siretEtablissementDeclarant: "22222222200002" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        relations: [{ siret: "22222222200002", referentiel: false, label: "test", type: "entreprise" }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.strictEqual(found.relations.length, 1);
    assert.strictEqual(found.relations[0].siret, "22222222200002");
    assert.strictEqual(found.relations[0].type, "formateur->responsable");
    assert.deepStrictEqual(found.relations[0].sources, ["other", "dummy"]);
  });

  it("Vérifie qu'on ignore les relations qui ne sont ni dans datagouv ni dans le referentiel", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        relations: [{ siret: "22222222200002", type: "entreprise", label: "test" }],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.relations, []);
  });

  it("Vérifie qu'on peut collecter des reseaux", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        reseaux: ["test"],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["test"]);
  });

  it("Vérifie qu'on ne duplique pas les reseaux", async () => {
    await insertOrganisme({
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

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["test"]);
  });

  it("Vérifie qu'on peut collecter des natures", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        natures: ["responsable"],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({}, { _id: 0 });
    assert.deepStrictEqual(found.natures, ["responsable"]);
  });

  it("Vérifie qu'on ne duplique pas les natures", async () => {
    await insertOrganisme({
      siret: "11111111100006",
      natures: ["responsable"],
    });
    let source = createTestSource([
      {
        selector: "11111111100006",
        natures: ["responsable"],
      },
    ]);

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found.natures, ["responsable"]);
  });

  it("Vérifie qu'on peut filter par siret", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    await insertOrganisme({ siret: "33333333300008" });
    let source = createTestSource([
      {
        selector: "11111111100006",
        reseaux: ["test"],
      },
      {
        selector: "33333333300008",
        reseaux: ["test"],
      },
    ]);

    let stats = await collectSources(source, { filters: { siret: "33333333300008" } });

    let found = await dbCollection("organismes").findOne({ siret: "33333333300008" });
    assert.deepStrictEqual(found.reseaux, ["test"]);
    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        updated: 1,
        unknown: 0,
        failed: 0,
        anomalies: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter en se basant sur l'uai confirmé", async () => {
    await insertOrganisme({
      siret: "11111111100006",
      uai: "0011073X",
    });
    let source = createTestSource([
      {
        selector: "0011073X",
        reseaux: ["test"],
      },
    ]);

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["test"]);
    assert.deepStrictEqual(stats, {
      dummy: {
        total: 1,
        updated: 1,
        unknown: 0,
        failed: 0,
        anomalies: 0,
      },
    });
  });
});
