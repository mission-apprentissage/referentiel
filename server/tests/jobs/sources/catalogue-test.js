const assert = require("assert");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { mockCatalogueApi, mockGeoAddresseApi } = require("../../utils/apiMocks");
const { insertOrganisme, insertCFD, insertDatagouv } = require("../../utils/fakeData");
const { dbCollection } = require("../../../src/common/db/mongodb");

function mockApis(custom = {}) {
  mockCatalogueApi((client, responses) => {
    client
      .get((uri) => uri.includes("formations.json"))
      .query(() => true)
      .reply(200, responses.formations(custom.formations));
  });

  mockGeoAddresseApi((client, responses) => {
    client
      .get((uri) => uri.includes("reverse"))
      .query(() => true)
      .reply(200, responses.reverse(custom.reverse));
  });
}

describe("catalogue", () => {
  it("Vérifie qu'on peut collecter les natures", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    await insertOrganisme({ siret: "22222222200002" });
    const source = createSource("catalogue");
    mockApis({
      formations: [
        {
          etablissement_gestionnaire_siret: "11111111100006",
          etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
          etablissement_formateur_siret: "22222222200002",
          etablissement_formateur_entreprise_raison_sociale: "Etablissement",
        },
      ],
    });

    const stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found.nature, "responsable");

    found = await dbCollection("organismes").findOne({ siret: "22222222200002" });
    assert.deepStrictEqual(found.nature, "formateur");
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

  it("Vérifie qu'on peut collecter la nature responsable_formateur", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    const source = createSource("catalogue");
    mockApis({
      formations: [
        {
          etablissement_gestionnaire_siret: "11111111100006",
          etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
          etablissement_formateur_siret: "11111111100006",
          etablissement_formateur_entreprise_raison_sociale: "Etablissement",
        },
      ],
    });

    await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found.nature, "responsable_formateur");
  });

  it("Vérifie qu'on peut collecter des relations (responsable->formateur)", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    await insertDatagouv({ siren: "222222222", siretEtablissementDeclarant: "22222222200002" });
    const source = createSource("catalogue");
    mockApis({
      formations: [
        {
          etablissement_gestionnaire_siret: "11111111100006",
          etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
          etablissement_formateur_siret: "22222222200002",
          etablissement_formateur_entreprise_raison_sociale: "Etablissement",
        },
      ],
    });

    await collectSources(source);

    const found = await dbCollection("organismes").findOne(
      { siret: "11111111100006" },
      { projection: { "relations.date_vue": 0 } }
    );
    assert.deepStrictEqual(found.relations, [
      {
        siret: "22222222200002",
        label: "Etablissement",
        referentiel: false,
        type: "responsable->formateur",
        sources: ["catalogue"],
      },
    ]);
  });

  it("Vérifie qu'on peut collecter des relations (formateur->responsable)", async () => {
    await insertOrganisme({ siret: "22222222200002" });
    await insertDatagouv({ siren: "111111111", siretEtablissementDeclarant: "11111111100006" });
    await insertDatagouv({ siren: "222222222", siretEtablissementDeclarant: "22222222200002" });
    const source = createSource("catalogue");
    mockApis({
      formations: [
        {
          etablissement_gestionnaire_siret: "11111111100006",
          etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
          etablissement_formateur_siret: "22222222200002",
          etablissement_formateur_entreprise_raison_sociale: "Etablissement",
        },
      ],
    });

    await collectSources(source);

    const found = await dbCollection("organismes").findOne(
      { siret: "22222222200002" },
      { projection: { "relations.date_vue": 0 } }
    );
    assert.deepStrictEqual(found.relations, [
      {
        siret: "11111111100006",
        label: "Entreprise",
        referentiel: false,
        type: "formateur->responsable",
        sources: ["catalogue"],
      },
    ]);
  });

  it("Vérifie qu'on ignore les relations quand l'établisssement est responsable et formateur", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    const source = createSource("catalogue");
    mockApis({
      formations: [
        {
          etablissement_gestionnaire_siret: "11111111100006",
          etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
          etablissement_formateur_siret: "11111111100006",
          etablissement_formateur_entreprise_raison_sociale: "Etablissement",
        },
      ],
    });

    await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" });
    assert.deepStrictEqual(found.relations, []);
  });

  it("Vérifie qu'on peut détecter des relations avec des organismes déjà présents", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    await insertOrganisme({ siret: "22222222200002", raison_sociale: "Mon centre de formation" });
    await insertDatagouv({ siren: "222222222", siretEtablissementDeclarant: "22222222200002" });
    const source = createSource("catalogue");
    mockApis({
      formations: [
        {
          etablissement_gestionnaire_siret: "11111111100006",
          etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
          etablissement_formateur_siret: "22222222200002",
          etablissement_formateur_entreprise_raison_sociale: "Etablissement",
        },
      ],
    });

    await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.strictEqual(found.relations[0].referentiel, true);
  });

  it("Vérifie qu'on peut collecter des diplômes (cfd)", async () => {
    await insertOrganisme({ siret: "22222222200002" });
    const source = createSource("catalogue");
    mockApis({
      formations: [
        {
          etablissement_formateur_siret: "22222222200002",
          etablissement_formateur_entreprise_raison_sociale: "Etablissement",
          cfd: "40030001",
          cfd_specialite: null,
        },
      ],
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne(
      { siret: "22222222200002" },
      { projection: { "diplomes.date_vue": 0 } }
    );
    assert.deepStrictEqual(found.diplomes, [
      {
        code: "40030001",
        type: "cfd",
        sources: ["catalogue"],
      },
    ]);
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 2,
        updated: 1,
        unknown: 1,
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
    await insertOrganisme({ siret: "22222222200002" });
    const source = createSource("catalogue");
    mockApis({
      etablissesment_formateur_siret: "22222222200002",
      etablissement_formateur_entreprise_raison_sociale: "Etablissement",
      cfd: "40030001",
    });

    await collectSources(source);

    const found = await dbCollection("organismes").findOne(
      { siret: "22222222200002" },
      { projection: { "diplomes.date_vue": 0 } }
    );
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

  it("Vérifie qu'on ne collecte pas de diplômes pour les organismes responsables", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    const source = createSource("catalogue");
    mockApis({
      formations: [
        {
          etablissement_gestionnaire_siret: "11111111100006",
          etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
          cfd: "40030001",
        },
      ],
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.diplomes, []);
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 2,
        updated: 1,
        unknown: 1,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des certifications (rncp)", async () => {
    await insertOrganisme({ siret: "22222222200002" });
    const source = createSource("catalogue");
    mockApis({
      formations: [
        {
          etablissement_formateur_siret: "22222222200002",
          etablissement_formateur_entreprise_raison_sociale: "Etablissement",
          rncp_code: "RNCP28662",
          rncp_intitule: "Gestionnaire de l'administration des ventes et de la relation commerciale",
        },
      ],
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne(
      { siret: "22222222200002" },
      { projection: { "certifications.date_vue": 0 } }
    );
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
        total: 2,
        updated: 1,
        unknown: 1,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on ne collecte pas de certifications pour les organismes responsables", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    const source = createSource("catalogue");
    mockApis({
      formations: [
        {
          etablissement_gestionnaire_siret: "11111111100006",
          etablissement_gestionnaire_entreprise_raison_sociale: "Entreprise",
          rncp_code: "RNCP28662",
          rncp_intitule: "Gestionnaire de l'administration des ventes et de la relation commerciale",
        },
      ],
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.certifications, []);
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 2,
        updated: 1,
        unknown: 1,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des lieux de formation", async () => {
    await insertOrganisme({ siret: "22222222200002" });
    const source = createSource("catalogue");
    mockApis({
      formations: [
        {
          etablissement_formateur_siret: "22222222200002",
          lieu_formation_geo_coordonnees: "48.879706,2.396444",
          uai_formation: "0751234J",
          lieu_formation_siret: "33333333300008",
        },
      ],
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
    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne(
      { siret: "22222222200002" },
      { projection: { "lieux_de_formation.date_vue": 0 } }
    );

    assert.deepStrictEqual(found.lieux_de_formation[0], {
      sources: ["catalogue"],
      uai: "0751234J",
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
          properties: { score: 0.88, source: "geo-adresse-api" },
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
        total: 2,
        updated: 1,
        unknown: 1,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on ne collecte pas des lieux de formation pour les organismes responsables", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    const source = createSource("catalogue");
    mockApis({
      formations: [
        {
          etablissement_gestionnaire_siret: "11111111100006",
          lieu_formation_geo_coordonnees: "48.879706,2.396444",
        },
      ],
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });

    assert.deepStrictEqual(found.lieux_de_formation, []);
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 2,
        updated: 1,
        unknown: 1,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on crée une anomalie quand on ne peut pas trouver l'adresse d'un lieu de formation", async () => {
    await insertOrganisme({ siret: "22222222200002" });
    const source = createSource("catalogue");
    mockCatalogueApi((client, responses) => {
      client
        .get((uri) => uri.includes("formations.json"))
        .query(() => true)
        .reply(
          200,
          responses.formations([
            {
              etablissement_formateur_siret: "22222222200002",
            },
          ])
        );
    });
    mockGeoAddresseApi((client) => {
      client
        .get((uri) => uri.includes("reverse"))
        .query(() => true)
        .reply(400, {});
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne(
      { siret: "22222222200002" },
      { projection: { "_meta.anomalies.date_vue": 0, "_meta.anomalies.date": 0 } }
    );

    assert.strictEqual(found.lieux_de_formation.length, 0);
    assert.deepStrictEqual(found._meta.anomalies, [
      {
        key: "lieudeformation_31 rue des lilas",
        type: "lieudeformation_geoloc_impossible",
        sources: ["catalogue"],
        job: "collect",
        details:
          "Lieu de formation non géolocalisable : 31 rue des lilas. Coordonnées inconnues [2.396444,48.879706] " +
          "(cause: [GeoAdresseApi] Request failed with status code 400)",
      },
    ]);
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 2,
        updated: 1,
        unknown: 1,
        anomalies: 1,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on crée une anomalie quand il n'y a pas de geoloc pour le lieu de formation", async () => {
    await insertOrganisme({ siret: "22222222200002" });
    const source = createSource("catalogue");
    mockApis({
      formations: [
        {
          etablissement_gestionnaire_siret: "11111111100006",
          lieu_formation_geo_coordonnees: null,
        },
      ],
    });

    await collectSources(source);

    const found = await dbCollection("organismes").findOne(
      { siret: "22222222200002" },
      { projection: { "_meta.anomalies.date_vue": 0, "_meta.anomalies.date": 0 } }
    );
    assert.strictEqual(found.lieux_de_formation.length, 0);
    assert.deepStrictEqual(found._meta.anomalies, [
      {
        key: "lieudeformation_31 rue des lilas",
        type: "lieudeformation_geoloc_inconnu",
        sources: ["catalogue"],
        job: "collect",
        details: "Lieu de formation inconnu : 31 rue des lilas.",
      },
    ]);
  });

  it("Vérifie qu'on peut collecter des contacts", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    const source = createSource("catalogue");
    mockApis({
      formations: [
        {
          email: "robert@formation.fr",
          id_rco_formation: "01_GE107880|01_GE339324|01_GE520062|76930",
          etablissement_gestionnaire_siret: "11111111100006",
        },
      ],
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne(
      { siret: "11111111100006" },
      { projection: { "contacts.date_vue": 0 } }
    );
    assert.deepStrictEqual(found.contacts, [
      {
        email: "robert@formation.fr",
        confirmé: false,
        sources: ["catalogue"],
      },
    ]);
    assert.deepStrictEqual(stats, {
      catalogue: {
        total: 2,
        updated: 1,
        unknown: 1,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des emails multiples", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    const source = createSource("catalogue");
    mockApis({
      formations: [
        {
          email: "robert@formation.fr##henri@formation.fr",
          etablissement_gestionnaire_siret: "11111111100006",
        },
      ],
    });

    const stats = await collectSources(source);

    const found = await dbCollection("organismes").findOne(
      { siret: "11111111100006" },
      { projection: { "contacts.date_vue": 0 } }
    );
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
        total: 2,
        updated: 1,
        unknown: 1,
        anomalies: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut filter par siret", async () => {
    await insertOrganisme({
      siret: "11111111100000",
    });
    const source = createSource("catalogue");
    mockApis();

    const stats = await collectSources(source, { filters: { siret: "33333333300008" } });

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
});
