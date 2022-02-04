const assert = require("assert");
const { omit } = require("lodash");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { mockSireneApi, mockGeoAddresseApi } = require("../../utils/apiMocks");
const { DateTime } = require("luxon");
const { insertDatagouv, insertOrganisme } = require("../../utils/fakeData");

function withGeoApiMock() {
  mockGeoAddresseApi((client, responses) => {
    client
      .get((uri) => uri.includes("search"))
      .query(() => true)
      .reply(200, responses.search());
  });
}

function withSireneApiMocks() {
  mockSireneApi((client, responses) => {
    client
      .get((uri) => uri.includes("unites_legales"))
      .query(() => true)
      .reply(200, responses.unitesLegales());
  });
}

describe("sirene", () => {
  it("Vérifie qu'on peut collecter des informations de l'API Sirene", async () => {
    let source = createSource("sirene");
    withGeoApiMock();
    withSireneApiMocks();
    await insertOrganisme({ siret: "11111111100006" });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.strictEqual(found.raison_sociale, "NOMAYO");
    assert.strictEqual(found.enseigne, "ENSEIGNE");
    assert.strictEqual(found.siege_social, true);
    assert.strictEqual(found.etat_administratif, "actif");
    assert.deepStrictEqual(found.forme_juridique, { code: "5710", label: "SAS, société par actions simplifiée" });
    assert.deepStrictEqual(found.adresse, {
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
    });
    assert.deepStrictEqual(stats, {
      sirene: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut filter par siret", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createSource("sirene");
    withGeoApiMock();
    withSireneApiMocks();

    let stats = await collectSources(source, { filters: { siret: "33333333300008" } });

    assert.deepStrictEqual(stats, {
      sirene: {
        total: 0,
        updated: 0,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des relations", async () => {
    let source = createSource("sirene");
    withGeoApiMock();
    mockSireneApi((client, responses) => {
      client
        .get((uri) => uri.includes("unites_legales"))
        .query(() => true)
        .reply(
          200,
          responses.unitesLegales({
            unite_legale: {
              etablissements: [
                {
                  siret: "11111111100006",
                  etat_administratif: "A",
                  etablissement_siege: "true",
                  libelle_voie: "DES LILAS",
                  code_postal: "75019",
                  libelle_commune: "PARIS",
                },
                {
                  siret: "11111111122222",
                  etat_administratif: "A",
                  etablissement_siege: "false",
                  libelle_voie: "DES LILAS",
                  code_postal: "75001",
                  libelle_commune: "PARIS",
                },
              ],
            },
          })
        );
    });
    await Promise.all([
      await insertOrganisme({ siret: "11111111100006" }),
      insertDatagouv({ siren: "111111111", siretEtablissementDeclarant: "11111111100006" }),
      insertDatagouv({ siren: "111111111", siretEtablissementDeclarant: "11111111122222" }),
    ]);

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.relations, [
      {
        siret: "11111111122222",
        label: "NOMAYO 75001 PARIS",
        type: "entreprise",
        referentiel: false,
        sources: ["sirene"],
      },
    ]);
    assert.deepStrictEqual(stats, {
      sirene: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on ignore les relations pour des organismes fermés", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createSource("sirene");
    withGeoApiMock();
    mockSireneApi((client, responses) => {
      client
        .get((uri) => uri.includes("unites_legales"))
        .query(() => true)
        .reply(
          200,
          responses.unitesLegales({
            unite_legale: {
              etablissements: [
                {
                  siret: "11111111100006",
                  etat_administratif: "A",
                  etablissement_siege: "true",
                  libelle_voie: "DES LILAS",
                  code_postal: "75019",
                  libelle_commune: "PARIS",
                },
                {
                  siret: "11111111122222",
                  denomination_usuelle: "NOMAYO2",
                  etat_administratif: "F",
                  etablissement_siege: "false",
                  libelle_voie: "DES LILAS",
                  code_postal: "75001",
                  libelle_commune: "PARIS",
                },
              ],
            },
          })
        );
    });

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.relations, []);
  });

  it("Vérifie qu'on gère une erreur lors de la récupération des informations de l'API Sirene", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createSource("sirene");
    withGeoApiMock();
    mockSireneApi((client) => {
      client
        .get((uri) => uri.includes("unites_legales"))
        .query(() => true)
        .reply(500, {});
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found._meta.anomalies[0].details, "[SireneApi] Request failed with status code 500");
    assert.deepStrictEqual(stats, {
      sirene: {
        total: 1,
        updated: 0,
        unknown: 0,
        anomalies: 1,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on gère une erreur spécifique quand l'organisme n'existe pas", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createSource("sirene");
    withGeoApiMock();
    mockSireneApi((client) => {
      client
        .get((uri) => uri.includes("unites_legales"))
        .query(() => true)
        .reply(200, { unite_legale: { etablissements: [] } });
    });

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found._meta.anomalies[0].details, "Etablissement inconnu pour l'entreprise 111111111");
  });

  it("Vérifie qu'on gère une erreur spécifique quand l'entreprise n'existe pas", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createSource("sirene");
    withGeoApiMock();
    mockSireneApi((client) => {
      client
        .get((uri) => uri.includes("unites_legales"))
        .query(() => true)
        .reply(404, {});
    });

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found._meta.anomalies[0].details, "Entreprise inconnue");
  });

  it("Vérifie qu'on crée une anomalie quand on ne peut pas trouver l'adresse", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createSource("sirene");
    withSireneApiMocks();
    mockGeoAddresseApi((client) => {
      client
        .get((uri) => uri.includes("search"))
        .query(() => true)
        .reply(400, {});
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.strictEqual(found._meta.anomalies.length, 1);
    assert.deepStrictEqual(omit(found._meta.anomalies[0], ["date"]), {
      job: "collect",
      source: "sirene",
      code: "etablissement_geoloc_impossible",
      details:
        "Geocoding impossible pour l'adresse 31 B RUE DES LILAS 75001 PARIS " +
        "(cause: [GeoAdresseApi] Request failed with status code 400)",
    });
    assert.deepStrictEqual(stats, {
      sirene: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 1,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on crée une anomalie quand on ne peut pas trouver la catégorie juridique", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createSource("sirene");
    withGeoApiMock();
    mockSireneApi((client, responses) => {
      client
        .get((uri) => uri.includes("unites_legales"))
        .query(() => true)
        .reply(200, responses.unitesLegales({ unite_legale: { categorie_juridique: "INVALID" } }));
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.strictEqual(found._meta.anomalies.length, 1);
    assert.deepStrictEqual(omit(found._meta.anomalies[0], ["date"]), {
      job: "collect",
      source: "sirene",
      code: "categorie_juridique_inconnue",
      details: "Impossible de trouver la catégorie juridique de l'entreprise : INVALID",
    });
    assert.deepStrictEqual(stats, {
      sirene: {
        total: 1,
        updated: 1,
        unknown: 0,
        anomalies: 1,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on met en cache les données de l'API sirene", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createSource("sirene");
    withGeoApiMock();
    withSireneApiMocks();

    await collectSources(source);

    let found = await dbCollection("cache").findOne({ _id: "sirene_111111111" });
    assert.deepStrictEqual(found._id, "sirene_111111111");
    assert.ok(found.expires_at > DateTime.now().plus({ hour: 1 }).toJSDate());
    assert.ok(found.value);
  });

  it("Vérifie qu'on met en cache les erreurs 4xx de l'API sirene", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createSource("sirene");
    withGeoApiMock();
    mockSireneApi((client) => {
      client
        .get((uri) => uri.includes("unites_legales"))
        .query(() => true)
        .reply(404, {});
    });

    await collectSources(source);

    let found = await dbCollection("cache").findOne({ _id: "sirene_111111111" });
    assert.deepStrictEqual(found._id, "sirene_111111111");
    assert.strictEqual(found.type, "error");
    assert.deepStrictEqual(found.value.message, "[SireneApi] Request failed with status code 404");
  });

  it("Vérifie qu'on ne met pas en cache les erreurs 5xx de l'API sirene", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createSource("sirene");
    withGeoApiMock();
    mockSireneApi((client) => {
      client
        .get((uri) => uri.includes("unites_legales"))
        .query(() => true)
        .reply(500, {});
    });

    await collectSources(source);

    let found = await dbCollection("cache").findOne({ _id: "sirene_111111111" });
    assert.deepStrictEqual(found, null);
  });
});
