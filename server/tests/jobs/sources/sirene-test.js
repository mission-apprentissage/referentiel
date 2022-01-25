const assert = require("assert");
const { omit } = require("lodash");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { importOrganismesForTest } = require("../../utils/testUtils");
const { mockSireneApi, mockGeoAddresseApi } = require("../../utils/apiMocks");
const { DateTime } = require("luxon");
const { insertDatagouv, insertOrganisme } = require("../../utils/fakeData");

function createSireneSource(options = {}) {
  let { withPredefinedMocks = [], ...custom } = options;

  if (withPredefinedMocks.includes("geoMocks")) {
    mockGeoAddresseApi((client, responses) => {
      client
        .get((uri) => uri.includes("reverse"))
        .query(() => true)
        .reply(200, responses.reverse());

      client
        .get((uri) => uri.includes("search"))
        .query(() => true)
        .reply(400, {});
    });
  }

  if (withPredefinedMocks.includes("sireneMocks")) {
    mockSireneApi((client, responses) => {
      client
        .get((uri) => uri.includes("unites_legales"))
        .query(() => true)
        .reply(200, responses.unitesLegales());
    });
  }

  return createSource("sirene", {
    organismes: ["11111111100006"],
    ...custom,
  });
}

describe("sirene", () => {
  it("Vérifie qu'on peut collecter des informations de l'API Sirene", async () => {
    let source = createSireneSource({ withPredefinedMocks: ["geoMocks", "sireneMocks"] });
    await importOrganismesForTest();

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

  it("Vérifie qu'on recherche une adresse quand ne peut pas reverse-geocoder", async () => {
    await importOrganismesForTest();
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

    let source = createSireneSource({ withPredefinedMocks: ["sireneMocks"] });
    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
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

  it("Vérifie qu'on recherche une adresse quand le code postal du reverse-geocoding n'est pas le même que l'adresse", async () => {
    await importOrganismesForTest();
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
                  code_postal: "93100",
                  libelle_commune: "MONTREUIL",
                },
              ],
            },
          })
        );
    });

    mockGeoAddresseApi((client, responses) => {
      client
        .get((uri) => uri.includes("reverse"))
        .query(() => true)
        .reply(200, responses.reverse());

      client
        .get((uri) => uri.includes("search"))
        .query(() => true)
        .reply(
          200,
          responses.search({
            features: [
              {
                properties: {
                  label: "31 Rue des lilas 93100 Montreuil",
                  housenumber: "31",
                  name: "31 Rue des Lilas",
                  postcode: "93100",
                  citycode: "93048",
                  city: "Montreuil",
                },
              },
            ],
          })
        );
    });

    let source = createSireneSource();
    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.strictEqual(found.adresse.label, "31 Rue des lilas 93100 Montreuil");
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

  it("Vérifie qu'on recherche une adresse quand il n'y a pas d'informations de geocoding", async () => {
    await importOrganismesForTest();
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
                  longitude: null,
                  latitude: null,
                },
              ],
            },
          })
        );
    });

    mockGeoAddresseApi((client, responses) => {
      client
        .get((uri) => uri.includes("reverse"))
        .query(() => true)
        .reply(500, responses.reverse());

      client
        .get((uri) => uri.includes("search"))
        .query(() => true)
        .reply(200, responses.search());
    });

    let source = createSireneSource();
    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.strictEqual(found.adresse.label, "31 Rue des lilas 75019 Paris");
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

  it("Vérifie qu'on ne recherche pas une adresse si elle a déjà été resolue", async () => {
    let source = createSireneSource({ withPredefinedMocks: ["sireneMocks"] });
    await insertOrganisme({ siret: "11111111100006" });
    mockGeoAddresseApi((client, responses) => {
      client
        .get((uri) => uri.includes("reverse"))
        .query(() => true)
        .reply(
          200,
          responses.reverse({
            features: [
              {
                properties: {
                  label: "32 rue des lilas Paris 75019",
                  housenumber: "32",
                  name: "32 rue des Lilas",
                  postcode: "75019",
                  citycode: "75000",
                  city: "Montreuil",
                },
              },
            ],
          })
        );

      client
        .get((uri) => uri.includes("search"))
        .query(() => true)
        .reply(400, {});
    });

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.strictEqual(found.adresse.label, "31 rue des lilas Paris 75019");
  });

  it("Vérifie qu'on peut filter par siret", async () => {
    await importOrganismesForTest([{ siret: "11111111100006" }]);

    let source = createSireneSource({
      withPredefinedMocks: ["geoMocks", "sireneMocks"],
      organismes: ["11111111100006"],
    });

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
    await Promise.all([
      importOrganismesForTest(),
      insertDatagouv({ siren: "111111111", siretEtablissementDeclarant: "11111111100006" }),
      insertDatagouv({ siren: "111111111", siretEtablissementDeclarant: "11111111122222" }),
    ]);

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

    let source = createSireneSource({
      withPredefinedMocks: ["geoMocks"],
    });
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

  it("Vérifie qu'on ignore les relations qui ne sont pas des organismes de formations", async () => {
    await Promise.all([
      importOrganismesForTest([{ siret: "11111111100006" }]),
      insertDatagouv({ siren: "222222222", siretEtablissementDeclarant: "22222222222222" }),
    ]);
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
                  siret: "22222222222222",
                  etat_administratif: "A",
                  etablissement_siege: "true",
                  libelle_voie: "DES LILAS",
                  code_postal: "75019",
                  libelle_commune: "PARIS",
                },
              ],
            },
          })
        );
    });

    let source = createSireneSource({ withPredefinedMocks: ["geoMocks"] });
    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.strictEqual(found.relations.length, 1);
    assert.deepStrictEqual(found.relations[0].siret, "22222222222222");
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
    await importOrganismesForTest();
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

    let source = createSireneSource({
      organismes: ["11111111100006", "11111111122222"],
    });
    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.relations, []);
  });

  it("Vérifie qu'on gère une erreur lors de la récupération des informations de l'API Sirene", async () => {
    await importOrganismesForTest();
    mockSireneApi((client) => {
      client
        .get((uri) => uri.includes("unites_legales"))
        .query(() => true)
        .reply(500, {});
    });

    let source = createSireneSource();
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
    await importOrganismesForTest();
    mockSireneApi((client) => {
      client
        .get((uri) => uri.includes("unites_legales"))
        .query(() => true)
        .reply(200, { unite_legale: { etablissements: [] } });
    });

    let source = createSireneSource();
    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found._meta.anomalies[0].details, "Etablissement inconnu pour l'entreprise 111111111");
  });

  it("Vérifie qu'on gère une erreur spécifique quand l'entreprise n'existe pas", async () => {
    await importOrganismesForTest();
    mockSireneApi((client) => {
      client
        .get((uri) => uri.includes("unites_legales"))
        .query(() => true)
        .reply(404, {});
    });

    let source = createSireneSource();
    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found._meta.anomalies[0].details, "Entreprise inconnue");
  });

  it("Vérifie qu'on crée une anomalie quand on ne peut pas trouver l'adresse", async () => {
    await importOrganismesForTest();
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

    let source = createSireneSource({ withPredefinedMocks: ["sireneMocks"] });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.strictEqual(found._meta.anomalies.length, 1);
    assert.deepStrictEqual(omit(found._meta.anomalies[0], ["date"]), {
      job: "collect",
      source: "sirene",
      code: "etablissement_geoloc_impossible",
      details: "Impossible de géolocaliser l'adresse de l'organisme. [2.396147,48.880391]",
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
    await importOrganismesForTest();
    mockSireneApi((client, responses) => {
      client
        .get((uri) => uri.includes("unites_legales"))
        .query(() => true)
        .reply(200, responses.unitesLegales({ unite_legale: { categorie_juridique: "INVALID" } }));
    });

    let source = createSireneSource({ withPredefinedMocks: ["geoMocks"] });
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
    await importOrganismesForTest();
    let source = createSireneSource({ withPredefinedMocks: ["geoMocks", "sireneMocks"] });

    await collectSources(source);

    let found = await dbCollection("cache").findOne({ _id: "sirene_111111111" });
    assert.deepStrictEqual(found._id, "sirene_111111111");
    assert.ok(found.expires_at > DateTime.now().plus({ hour: 1 }).toJSDate());
    assert.ok(found.value);
  });

  it("Vérifie qu'on met en cache les erreurs 4xx de l'API sirene", async () => {
    await importOrganismesForTest();
    mockSireneApi((client) => {
      client
        .get((uri) => uri.includes("unites_legales"))
        .query(() => true)
        .reply(404, {});
    });

    let source = createSireneSource();
    await collectSources(source);

    let found = await dbCollection("cache").findOne({ _id: "sirene_111111111" });
    assert.deepStrictEqual(found._id, "sirene_111111111");
    assert.strictEqual(found.type, "error");
    assert.deepStrictEqual(found.value.message, "[SireneApi] Request failed with status code 404");
  });

  it("Vérifie qu'on ne met pas en cache les erreurs 5xx de l'API sirene", async () => {
    await importOrganismesForTest();
    mockSireneApi((client) => {
      client
        .get((uri) => uri.includes("unites_legales"))
        .query(() => true)
        .reply(500, {});
    });

    let source = createSireneSource();
    await collectSources(source);

    let found = await dbCollection("cache").findOne({ _id: "sirene_111111111" });
    assert.deepStrictEqual(found, null);
  });
});
