const assert = require("assert");
const { omit } = require("lodash");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { mockGeoAddresseApi } = require("../../utils/apiMocks");
const { insertDatagouv, insertOrganisme, insertCommunes } = require("../../utils/fakeData");
const { mockSireneApi } = require("../../utils/apiMocks.js");

function withGeoApiMock() {
  mockGeoAddresseApi((client, responses) => {
    client
      .get((uri) => uri.includes("search"))
      .query(() => true)
      .reply(200, responses.search());
  });
}

function withSireneApiMocks(custom) {
  mockSireneApi((client, responses) => {
    client
      .post((uri) => uri.includes("token"))
      .query(() => true)
      .reply(200, responses.token());

    client
      .post((uri) => uri.includes("siret"))
      .query(() => true)
      .reply(200, responses.siret(custom));
  });
}

describe("sirene", () => {
  it("Vérifie qu'on peut collecter des informations de l'API Sirene", async () => {
    const source = createSource("sirene");
    withGeoApiMock();
    withSireneApiMocks();
    await insertOrganisme({ siret: "11111111100006" });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
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
          source: "geo-adresse-api",
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
        total: 2,
        updated: 1,
        unknown: 1,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut filter par siret", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    const source = createSource("sirene");
    withGeoApiMock();
    withSireneApiMocks();

    const stats = await collectSources(source, { filters: { siret: "33333333300008" } });

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
    const source = createSource("sirene");
    withGeoApiMock();
    withSireneApiMocks({ etablissements: [{ siret: "11111111100006" }, { siret: "11111111100099", nic: "00099" }] });
    await Promise.all([
      await insertOrganisme({ siret: "11111111100006" }),
      insertDatagouv({ siren: "111111111", siretEtablissementDeclarant: "11111111100006" }),
      insertDatagouv({ siren: "111111111", siretEtablissementDeclarant: "11111111100099" }),
    ]);

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.relations, [
      {
        siret: "11111111100099",
        label: "NOMAYO 75019 PARIS",
        type: "entreprise",
        referentiel: false,
        sources: ["sirene"],
      },
    ]);
    assert.deepStrictEqual(stats, {
      sirene: {
        total: 4,
        updated: 2,
        unknown: 2,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on ignore les relations pour des organismes fermés", async () => {
    const source = createSource("sirene");
    withGeoApiMock();
    withSireneApiMocks({
      etablissements: [
        { siret: "11111111100006" },
        {
          siret: "11111111100099",
          nic: "00099",
          periodesEtablissement: [
            {
              etatAdministratifEtablissement: "F",
            },
          ],
        },
      ],
    });
    await Promise.all([
      await insertOrganisme({ siret: "11111111100006" }),
      insertDatagouv({ siren: "111111111", siretEtablissementDeclarant: "11111111100006" }),
      insertDatagouv({ siren: "111111111", siretEtablissementDeclarant: "11111111100099" }),
    ]);

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.relations, []);
    assert.deepStrictEqual(stats, {
      sirene: {
        total: 3,
        updated: 1,
        unknown: 2,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on gère une erreur lors de la récupération des informations de l'API Sirene", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    const source = createSource("sirene");
    withGeoApiMock();
    mockSireneApi((client, responses) => {
      client
        .post((uri) => uri.includes("token"))
        .query(() => true)
        .reply(500, responses.token());
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(omit(found._meta.anomalies[0], ["date"]), {
      key: "500",
      type: "erreur",
      sources: ["sirene"],
      details: "[SireneApi] Request failed with status code 500",
      job: "collect",
    });
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

  it("Vérifie qu'on crée une anomalie quand on ne peut pas trouver l'adresse", async () => {
    await insertOrganisme({ siret: "11111111100006" }, (o) => omit(o, ["adresse"]));
    const source = createSource("sirene");
    withSireneApiMocks();
    mockGeoAddresseApi((client) => {
      client
        .get((uri) => uri.includes("search"))
        .query(() => true)
        .reply(400, {});
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.strictEqual(found._meta.anomalies.length, 1);
    assert.deepStrictEqual(omit(found._meta.anomalies[0], ["date"]), {
      key: "adresse_31 RUE DES LILAS 75019 PARIS",
      sources: ["sirene"],
      type: "etablissement_geoloc_impossible",
      job: "collect",
      details:
        "Geocoding impossible pour l'adresse 31 RUE DES LILAS 75019 PARIS " +
        "(cause: [GeoAdresseApi] Request failed with status code 400)",
    });
    assert.deepStrictEqual(stats, {
      sirene: {
        total: 2,
        updated: 1,
        unknown: 1,
        anomalies: 1,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on crée une anomalie quand le score de l'adresse est trop faible (sans commune)", async () => {
    await insertOrganisme({ siret: "11111111100006" }, (o) => omit(o, ["adresse"]));
    const source = createSource("sirene");
    withSireneApiMocks();
    mockGeoAddresseApi((client, responses) => {
      client
        .get((uri) => uri.includes("search"))
        .query(() => true)
        .reply(
          200,
          responses.search({
            features: [
              {
                properties: {
                  score: 0,
                },
              },
            ],
          })
        );
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.ok(!found.adresse);
    assert.strictEqual(found._meta.anomalies.length, 1);
    assert.deepStrictEqual(omit(found._meta.anomalies[0], ["date"]), {
      key: "adresse_31 RUE DES LILAS 75019 PARIS",
      sources: ["sirene"],
      type: "etablissement_geoloc_impossible",
      job: "collect",
      details: "Score 0 trop faible pour l'adresse 31 RUE DES LILAS 75019 PARIS (lon:2.396444,lat:48.879706)",
    });
    assert.deepStrictEqual(stats, {
      sirene: {
        total: 2,
        updated: 1,
        unknown: 1,
        anomalies: 1,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on utilise la géolocalisation de la commune quand le score de l'adresse est trop faible", async () => {
    await insertOrganisme({ siret: "11111111100006" }, (o) => omit(o, ["adresse"]));
    await insertCommunes({
      properties: {
        codgeo: "75000",
        libgeo: "Paris",
        dep: "75",
        reg: "11",
        xcl2154: 636317,
        ycl2154: 6204292,
      },
    });
    const source = createSource("sirene");
    withSireneApiMocks();
    mockGeoAddresseApi((client, responses) => {
      client
        .get((uri) => uri.includes("search"))
        .query(() => true)
        .reply(
          200,
          responses.search({
            features: [
              {
                properties: {
                  score: 0,
                },
              },
            ],
          })
        );
    });

    await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.adresse, {
      label: "31 RUE DES LILAS 75019 PARIS",
      localite: "Paris",
      region: {
        code: "11",
        nom: "Île-de-France",
      },
      academie: {
        code: "01",
        nom: "Paris",
      },
      code_insee: "75000",
      code_postal: "75019",
      departement: {
        code: "75",
        nom: "Paris",
      },
      geojson: {
        type: "Feature",
        properties: {
          source: "commune",
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [2.2007059510300557, 42.950340977698936],
              [2.1962711908151356, 42.9445451370596],
              [2.19721475681831, 42.940810039758695],
              [2.1998567416271984, 42.937718924751046],
              [2.199196245424976, 42.934370216826096],
              [2.1957994078135483, 42.9296691460853],
              [2.1961768342148185, 42.92374450898732],
              [2.2100472544614824, 42.926191641701706],
              [2.217123999485291, 42.92870317264541],
              [2.21938855789291, 42.92664242930699],
              [2.2198603408944972, 42.92065339397967],
              [2.2218418295011633, 42.91827065949461],
              [2.2257104501141782, 42.915501535633595],
              [2.2299564971284633, 42.91112245603943],
              [2.2384485911570335, 42.909061712700996],
              [2.2442987003767154, 42.912410420625946],
              [2.245147909779573, 42.91459996042303],
              [2.2439212739754453, 42.91685389844944],
              [2.245525336180842, 42.922649739088776],
              [2.2421284985694143, 42.92702881868294],
              [2.241562358967509, 42.92902516379205],
              [2.2423172117700494, 42.9326314646343],
              [2.2369388855519547, 42.93353303984486],
              [2.235051753545606, 42.9361089690179],
              [2.2367501723513197, 42.93836290704431],
              [2.235146110145923, 42.93926448225487],
              [2.23156055933386, 42.938234110585654],
              [2.2266540161173527, 42.94422314591297],
              [2.218822418291005, 42.94860222550714],
              [2.2136328052735452, 42.95027657946961],
              [2.204951998044341, 42.948731021965784],
              [2.2007059510300557, 42.950340977698936],
            ],
          ],
        },
      },
    });
  });

  it("Vérifie qu'on crée une anomalie quand on ne peut pas trouver la catégorie juridique", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    const source = createSource("sirene");
    withGeoApiMock();
    mockSireneApi((client, responses) => {
      client
        .post((uri) => uri.includes("token"))
        .query(() => true)
        .reply(200, responses.token());

      client
        .post((uri) => uri.includes("siret"))
        .query(() => true)
        .reply(
          200,
          responses.siret({ etablissements: [{ uniteLegale: { categorieJuridiqueUniteLegale: "INVALID" } }] })
        );
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.strictEqual(found._meta.anomalies.length, 1);
    assert.deepStrictEqual(omit(found._meta.anomalies[0], ["date"]), {
      key: "categorie_juridique_INVALID",
      type: "categorie_juridique_inconnue",
      sources: ["sirene"],
      job: "collect",
      details: "Impossible de trouver la catégorie juridique de l'entreprise : INVALID",
    });
    assert.deepStrictEqual(stats, {
      sirene: {
        total: 2,
        updated: 1,
        unknown: 1,
        anomalies: 1,
        failed: 0,
      },
    });
  });
});
