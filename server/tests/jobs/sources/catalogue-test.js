const assert = require("assert");
const { omit } = require("lodash");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { importOrganismesForTest } = require("../../utils/testUtils");
const { mockCatalogueApi, mockGeoAddresseApi } = require("../../utils/apiMocks");
const { insertOrganisme, insertCFD } = require("../../utils/fakeData");
const { dbCollection } = require("../../../src/common/db/mongodb");

function mockApis(custom = {}) {
  mockCatalogueApi((client, responses) => {
    client
      .get((uri) => uri.includes("formations2021.ndjson"))
      .query(() => true)
      .reply(200, responses.formations(custom.formation));
  });

  mockGeoAddresseApi((client, responses) => {
    client
      .get((uri) => uri.includes("reverse"))
      .query(() => true)
      .reply(200, responses.reverse(custom.reverse));

    client
      .get((uri) => uri.includes("search"))
      .query(() => true)
      .reply(200, responses.search());
  });
}

describe("catalogue", () => {
  it("Vérifie qu'on peut collecter les statuts", async () => {
    await importOrganismesForTest([{ siret: "11111111100006" }, { siret: "22222222200002" }]);
    let source = createSource("catalogue");
    mockApis({
      formation: {
        etablissement_gestionnaire_siret: "11111111100006",
        etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
        etablissement_formateur_siret: "22222222200002",
        etablissement_formateur_entreprise_raison_sociale: "Etablissement",
      },
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found.statuts, ["gestionnaire"]);

    found = await dbCollection("organismes").findOne({ siret: "22222222200002" });
    assert.deepStrictEqual(found.statuts, ["formateur"]);
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 2,
        updated: 2,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter les statuts gestionnaire et formateur", async () => {
    await importOrganismesForTest();
    let source = createSource("catalogue");
    mockApis({
      formation: {
        etablissement_gestionnaire_siret: "11111111100006",
        etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
        etablissement_formateur_siret: "11111111100006",
        etablissement_formateur_entreprise_raison_sociale: "Etablissement",
      },
    });

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found.statuts, ["gestionnaire", "formateur"]);
  });

  it("Vérifie qu'on peut collecter des relations (formateur)", async () => {
    await importOrganismesForTest();
    let source = createSource("catalogue");
    mockApis({
      formation: {
        etablissement_gestionnaire_siret: "11111111100006",
        etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
        etablissement_formateur_siret: "22222222200002",
        etablissement_formateur_entreprise_raison_sociale: "Etablissement",
      },
    });

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found.relations, [
      {
        siret: "22222222200002",
        label: "Etablissement",
        referentiel: false,
        type: "formateur",
        sources: ["catalogue"],
      },
    ]);
  });

  it("Vérifie qu'on peut collecter des relations (gestionnaire)", async () => {
    await importOrganismesForTest();
    let source = createSource("catalogue");
    mockApis({
      formation: {
        etablissement_gestionnaire_siret: "22222222200002",
        etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
        etablissement_formateur_siret: "11111111100006",
        etablissement_formateur_entreprise_raison_sociale: "Etablissement",
      },
    });

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found.relations, [
      {
        siret: "22222222200002",
        label: "Entreprise",
        referentiel: false,
        type: "gestionnaire",
        sources: ["catalogue"],
      },
    ]);
  });

  it("Vérifie qu'on peut ignore les relations quand l'établisssement est gestionnaire et formateur", async () => {
    await importOrganismesForTest();
    let source = createSource("catalogue");
    mockApis({
      formation: {
        etablissement_gestionnaire_siret: "11111111100006",
        etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
        etablissement_formateur_siret: "11111111100006",
        etablissement_formateur_entreprise_raison_sociale: "Etablissement",
      },
    });

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found.relations, []);
  });

  it("Vérifie qu'on peut collecter des diplômes (cfd)", async () => {
    await importOrganismesForTest([{ siret: "22222222200002" }]);
    let source = createSource("catalogue");
    mockApis({
      formation: {
        etablissement_formateur_siret: "22222222200002",
        etablissement_formateur_entreprise_raison_sociale: "Etablissement",
        cfd: "40030001",
        cfd_specialite: null,
      },
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "22222222200002" }, { _id: 0 });
    assert.deepStrictEqual(found.diplomes, [
      {
        code: "40030001",
        type: "cfd",
        sources: ["catalogue"],
      },
    ]);
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des diplômes (cfd+bcn)", async () => {
    await insertCFD({
      FORMATION_DIPLOME: "40030001",
      NIVEAU_FORMATION_DIPLOME: "26C",
      LIBELLE_COURT: "FORMATION",
    });
    await importOrganismesForTest([{ siret: "22222222200002" }]);
    let source = createSource("catalogue");
    mockApis({
      etablissement_formateur_siret: "22222222200002",
      etablissement_formateur_entreprise_raison_sociale: "Etablissement",
      cfd: "40030001",
    });

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "22222222200002" }, { _id: 0 });
    assert.deepStrictEqual(found.diplomes, [
      {
        code: "40030001",
        type: "cfd",
        niveau: "26C",
        label: "FORMATION",
        sources: ["catalogue"],
      },
    ]);
  });

  it("Vérifie qu'on ne collecte pas de diplômes pour les organismes gestionnaire", async () => {
    await importOrganismesForTest([{ siret: "11111111100006" }]);
    let source = createSource("catalogue");
    mockApis({
      formation: {
        etablissement_gestionnaire_siret: "11111111100006",
        etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
        cfd: "40030001",
      },
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.diplomes, []);
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des certifications (rncp)", async () => {
    await importOrganismesForTest([{ siret: "22222222200002" }]);
    let source = createSource("catalogue");
    mockApis({
      formation: {
        etablissement_formateur_siret: "22222222200002",
        etablissement_formateur_entreprise_raison_sociale: "Etablissement",
        rncp_code: "RNCP28662",
        rncp_intitule: "Gestionnaire de l'administration des ventes et de la relation commerciale",
      },
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "22222222200002" }, { _id: 0 });
    assert.deepStrictEqual(found.certifications, [
      {
        code: "RNCP28662",
        label: "Gestionnaire de l'administration des ventes et de la relation commerciale",
        type: "rncp",
        sources: ["catalogue"],
      },
    ]);
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on ne collecte pas de certifications pour les organismes gestionnaire", async () => {
    await importOrganismesForTest([{ siret: "11111111100006" }]);
    let source = createSource("catalogue");
    mockApis({
      formation: {
        etablissement_gestionnaire_siret: "11111111100006",
        etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
        rncp_code: "RNCP28662",
        rncp_intitule: "Gestionnaire de l'administration des ventes et de la relation commerciale",
      },
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.certifications, []);
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des lieux de formation", async () => {
    await importOrganismesForTest([{ siret: "22222222200002" }]);
    let source = createSource("catalogue");
    mockApis({
      formation: {
        etablissement_formateur_siret: "22222222200002",
        lieu_formation_siret: "33333333300008",
        lieu_formation_geo_coordonnees: "48.879706,2.396444",
      },
      reverse: {
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [2.396444, 48.879706],
            },
            properties: {
              label: "32 Rue des lilas 75019 Paris",
              score: 0.88,
              name: "32 Rue des Lilas",
              city: "Paris",
            },
          },
        ],
      },
    });
    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "22222222200002" }, { _id: 0 });

    assert.deepStrictEqual(found.lieux_de_formation[0], {
      sources: ["catalogue"],
      siret: "33333333300008",
      code: "2.396444_48.879706",
      adresse: {
        label: "32 Rue des lilas 75019 Paris",
        code_postal: "75019",
        code_insee: "75119",
        localite: "Paris",
        geojson: {
          type: "Feature",
          geometry: { coordinates: [2.396444, 48.879706], type: "Point" },
          properties: { score: 0.88 },
        },
        departement: {
          code: "75",
          nom: "Paris",
        },
        region: {
          code: "11",
          nom: "Île-de-France",
        },
        academie: {
          code: "01",
          nom: "Paris",
        },
      },
    });
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on ne collecte pas des lieux de formation pour les organismes gestionnaire", async () => {
    await importOrganismesForTest([{ siret: "11111111100006" }]);
    let source = createSource("catalogue");
    mockApis({
      formation: {
        etablissement_gestionnaire_siret: "11111111100006",
        lieu_formation_siret: "33333333300008",
        lieu_formation_geo_coordonnees: "48.879706,2.396444",
      },
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });

    assert.deepStrictEqual(found.lieux_de_formation, []);
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on cherche une adresse quand on ne peut pas reverse-geocoder un lieu de formation", async () => {
    await importOrganismesForTest([{ siret: "22222222200002" }]);
    let source = createSource("catalogue");
    mockCatalogueApi((client, responses) => {
      client
        .get((uri) => uri.includes("formations2021.ndjson"))
        .query(() => true)
        .reply(
          200,
          responses.formations({
            etablissement_formateur_siret: "22222222200002",
          })
        );
    });
    mockGeoAddresseApi((client, responses) => {
      client
        .get((uri) => uri.includes("reverse"))
        .query(() => true)
        .reply(400, {});

      client
        .get((uri) => uri.includes("search"))
        .query(() => true)
        .reply(200, responses.search());
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "22222222200002" }, { _id: 0 });
    assert.deepStrictEqual(found.lieux_de_formation[0], {
      code: "2.396444_48.879706",
      sources: ["catalogue"],
      adresse: {
        geojson: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [2.396444, 48.879706],
          },
          properties: {
            score: 0.88,
          },
        },
        label: "31 Rue des lilas 75019 Paris",
        code_postal: "75019",
        code_insee: "75119",
        localite: "Paris",
        departement: {
          code: "75",
          nom: "Paris",
        },
        region: {
          code: "11",
          nom: "Île-de-France",
        },
        academie: {
          code: "01",
          nom: "Paris",
        },
      },
    });
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on créer une anomalie quand on ne peut pas trouver l'adresse d'un lieu de formation", async () => {
    await importOrganismesForTest([{ siret: "22222222200002" }]);
    let source = createSource("catalogue");
    mockCatalogueApi((client, responses) => {
      client
        .get((uri) => uri.includes("formations2021.ndjson"))
        .query(() => true)
        .reply(
          200,
          responses.formations({
            etablissement_formateur_siret: "22222222200002",
          })
        );
    });
    mockGeoAddresseApi((client) => {
      client
        .get((uri) => uri.includes("reverse"))
        .query(() => true)
        .reply(400, {});

      client
        .get((uri) => uri.includes("search"))
        .query(() => true)
        .reply(400, {});
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "22222222200002" }, { _id: 0 });

    assert.strictEqual(found.lieux_de_formation.length, 0);
    assert.strictEqual(found._meta.anomalies.length, 1);
    assert.deepStrictEqual(omit(found._meta.anomalies[0], ["date"]), {
      job: "collect",
      source: "catalogue",
      code: "lieudeformation_geoloc_impossible",
      details: "Lieu de formation inconnu : 31 rue des lilas. [2.396444,48.879706]",
    });
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 1,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des contacts", async () => {
    await importOrganismesForTest();
    let source = createSource("catalogue");
    mockApis({
      formation: {
        email: "robert@formation.fr",
        id_rco_formation: "01_GE107880|01_GE339324|01_GE520062|76930",
        etablissement_gestionnaire_siret: "11111111100006",
      },
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.contacts, [
      {
        email: "robert@formation.fr",
        confirmé: false,
        sources: ["catalogue"],
      },
    ]);
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des emails multiples", async () => {
    await importOrganismesForTest();
    let source = createSource("catalogue");
    mockApis({
      formation: {
        email: "robert@formation.fr##henri@formation.fr",
        etablissement_gestionnaire_siret: "11111111100006",
      },
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.contacts, [
      {
        email: "henri@formation.fr",
        confirmé: false,
        sources: ["catalogue"],
      },
      {
        email: "robert@formation.fr",
        confirmé: false,
        sources: ["catalogue"],
      },
    ]);
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut filter par siret", async () => {
    await insertOrganisme({
      siret: "11111111100000",
    });
    let source = createSource("catalogue");
    mockApis();

    let stats = await collectSources(source, { filters: { siret: "33333333300008" } });

    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 0,
        updated: 0,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut détecter des relations avec des organismes déjà présents", async () => {
    await importOrganismesForTest();
    await insertOrganisme({ siret: "22222222200002", raison_sociale: "Mon centre de formation" });
    let source = createSource("catalogue");
    mockApis({
      formation: {
        etablissement_gestionnaire_siret: "11111111100006",
        etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
        etablissement_formateur_siret: "22222222200002",
        etablissement_formateur_entreprise_raison_sociale: "Etablissement",
      },
    });

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.strictEqual(found.relations[0].referentiel, true);
  });
});
