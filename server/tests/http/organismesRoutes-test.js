const { strictEqual, deepStrictEqual } = require("assert");
const { insertOrganisme } = require("../utils/fakeData");
const { startServer, generateAuthHeader } = require("../utils/testUtils");
const { dbCollection } = require("../../src/common/db/mongodb");
const assert = require("assert");
const { omitDeep } = require("../../src/common/utils/objectUtils");

describe("organismesRoutes", () => {
  it("Vérifie qu'on peut lister des organismes", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      statuts: ["gestionnaire", "formateur"],
      raison_sociale: "Centre de formation",
      _meta: {
        anomalies: [],
        created_at: new Date("2021-02-10T16:39:13.064Z"),
      },
    });

    let response = await httpClient.get("/api/v1/organismes");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      organismes: [
        {
          siret: "11111111100001",
          raison_sociale: "Centre de formation",
          uai_potentiels: [],
          contacts: [],
          relations: [],
          lieux_de_formation: [],
          reseaux: [],
          statuts: ["gestionnaire", "formateur"],
          diplomes: [],
          certifications: [],
          siege_social: true,
          etat_administratif: "actif",
          referentiels: ["test"],
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
            label: "31 rue des lilas Paris 75019",
            code_postal: "75001",
            code_insee: "75000",
            localite: "PARIS",
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
          _meta: {
            anomalies: [],
            created_at: "2021-02-10T16:39:13.064Z",
            validation: "INCONNUE",
          },
        },
      ],
      pagination: {
        page: 1,
        resultats_par_page: 10,
        nombre_de_page: 1,
        total: 1,
      },
    });
  });

  it("Vérifie qu'on peut rechercher des organismes à partir d'un uai validé", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({ siret: "11111111100006", uai: "0751234J" });

    let response = await httpClient.get("/api/v1/organismes?uai=0751234J");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des organismes qui ont un uai", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({ siret: "11111111100006", uai: "0751234J" });
    await insertOrganisme();

    let response = await httpClient.get("/api/v1/organismes?uai=true");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des organismes qui n'ont pas d'uai", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({ siret: "11111111100006", uai: "0751234J" });
    await insertOrganisme({ siret: "22222222200002" });

    let response = await httpClient.get("/api/v1/organismes?uai=false");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir de leur nda", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({ siret: "11111111100006", numero_declaration_activite: "12345678901" });

    let response = await httpClient.get("/api/v1/organismes?numero_declaration_activite=12345678901");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des organismes qui ont un nda", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({ siret: "11111111100006", numero_declaration_activite: "12345678901" });

    let response = await httpClient.get("/api/v1/organismes?numero_declaration_activite=true");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des organismes qui n'ont pas d'uai", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({ siret: "11111111100006", numero_declaration_activite: "12345678901" });
    await insertOrganisme({ siret: "22222222200002" });

    let response = await httpClient.get("/api/v1/organismes?numero_declaration_activite=false");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des organismes qui ont des uais potentiels", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100006",
      uai_potentiels: [
        {
          sources: ["dummy"],
          uai: "0751234J",
          valide: true,
        },
      ],
    });
    await insertOrganisme();

    let response = await httpClient.get("/api/v1/organismes?uai_potentiel=true");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des organismes qui n'ont pas uais potentiels", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100006",
      uai_potentiels: [
        {
          sources: ["dummy"],
          uai: "0751234J",
          valide: true,
        },
      ],
    });
    await insertOrganisme({ siret: "22222222200002" });

    let response = await httpClient.get("/api/v1/organismes?uai_potentiel=false");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des organismes qui un uai potentiel particulier", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100006",
      uai_potentiels: [
        {
          sources: ["dummy"],
          uai: "0751234J",
          valide: true,
        },
      ],
    });
    await insertOrganisme({ siret: "22222222200002" });

    let response = await httpClient.get("/api/v1/organismes?uai_potentiel=0751234J");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir d'un siret", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({
      siret: "11111111100001",
    });

    let response = await httpClient.get("/api/v1/organismes?siret=11111111100001");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir d'un siren", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({
      siret: "11111111100001",
    });

    let response = await httpClient.get("/api/v1/organismes?siret=11111111100001");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir d'un uai (fulltext)", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({
      uai: "0010856A",
    });

    let response = await httpClient.get("/api/v1/organismes?text=0010856A");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes[0].uai, "0010856A");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir d'un siret (fulltext)", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({
      siret: "11111111100001",
    });

    let response = await httpClient.get("/api/v1/organismes?text=11111111100001");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir d'une académie", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      adresse: {
        academie: { code: "01", nom: "Paris" },
      },
    });
    await insertOrganisme({
      siret: "22222222200002",
      adresse: {
        academie: { code: "02", nom: "Aix-Marseille" },
      },
    });

    let response = await httpClient.get("/api/v1/organismes?academie=01");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir d'une région", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      adresse: {
        region: { code: "11", nom: "Île-de-France" },
      },
    });
    await insertOrganisme({
      siret: "22222222200002",
      adresse: {
        region: { code: "93", nom: "Provence-Alpes-Côte d'Azur" },
      },
    });

    let response = await httpClient.get("/api/v1/organismes?region=11");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir de leur département", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      adresse: {
        departement: { code: "75", nom: "Paris" },
      },
    });
    await insertOrganisme({
      siret: "22222222200002",
      adresse: {
        departement: { code: "11", nom: "Aude" },
      },
    });

    let response = await httpClient.get("/api/v1/organismes?departements=11");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir de plusieurs départements", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      adresse: {
        departement: { code: "75", nom: "Paris" },
      },
    });
    await insertOrganisme({
      siret: "22222222200002",
      adresse: {
        departement: { code: "11", nom: "Aude" },
      },
    });

    let response = await httpClient.get("/api/v1/organismes?departements=11,75");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 2);
  });

  it("Vérifie qu'on peut rechercher des organismes à partir d'un statut", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      statuts: ["gestionnaire"],
    });
    await insertOrganisme({
      siret: "22222222200002",
      statuts: ["formateur"],
    });

    let response = await httpClient.get("/api/v1/organismes?statuts=formateur");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir de plusieurs statuts", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      statuts: ["gestionnaire"],
    });
    await insertOrganisme({
      siret: "22222222200002",
      statuts: ["gestionnaire", "formateur"],
    });
    await insertOrganisme({
      siret: "333333333000003",
      statuts: ["formateur"],
    });

    let response = await httpClient.get("/api/v1/organismes?statuts=gestionnaire,formateur");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 3);
  });

  it("Vérifie qu'on peut limiter les champs renvoyés pour la liste des organismes", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      _meta: {
        anomalies: [],
        created_at: new Date("2021-02-10T16:39:13.064Z"),
      },
    });

    let response = await httpClient.get("/api/v1/organismes?champs=siret,uai");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      organismes: [
        {
          siret: "11111111100001",
        },
      ],
      pagination: {
        page: 1,
        resultats_par_page: 10,
        nombre_de_page: 1,
        total: 1,
      },
    });
  });

  it("Vérifie qu'on peut peut limiter le nombre d'organisme par page", async () => {
    const { httpClient } = await startServer();
    await Promise.all([
      insertOrganisme({ siret: "11111111100001" }),
      insertOrganisme({ siret: "22222222200002" }),
      insertOrganisme({ siret: "33333333300008" }),
    ]);

    let response = await httpClient.get("/api/v1/organismes?items_par_page=1&page=1");
    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);

    response = await httpClient.get("/api/v1/organismes?items_par_page=1&page=2");
    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
  });

  it("Vérifie qu'on peut filtrer les organismes avec des anomalies", async () => {
    const { httpClient } = await startServer();
    await Promise.all([
      insertOrganisme({
        siret: "11111111100001",
        _meta: {
          anomalies: [
            {
              job: "collect",
              source: "sirene",
              date: new Date("2021-02-10T08:31:58.572Z"),
            },
          ],
        },
      }),
      insertOrganisme({
        siret: "22222222200002",
      }),
    ]);

    let response = await httpClient.get("/api/v1/organismes?anomalies=true");
    strictEqual(response.status, 200);
    strictEqual(response.data.organismes[0].siret, "11111111100001");

    response = await httpClient.get("/api/v1/organismes?anomalies=false");
    strictEqual(response.status, 200);
    strictEqual(response.data.organismes[0].siret, "22222222200002");

    response = await httpClient.get("/api/v1/organismes");
    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 2);
  });

  it("Vérifie qu'on peut trier les résultats (asc)", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      _meta: {
        anomalies: [],
        created_at: new Date("2021-02-10T16:39:13.064Z"),
      },
    });
    await insertOrganisme({
      siret: "22222222200002",
      _meta: {
        anomalies: [],
        created_at: new Date("2020-02-10T16:39:13.064Z"),
      },
    });

    let response = await httpClient.get("/api/v1/organismes?ordre=asc");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes[0].siret, "22222222200002");
    strictEqual(response.data.organismes[1].siret, "11111111100001");
  });

  it("Vérifie qu'on peut trier les résultats (desc)", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      _meta: {
        anomalies: [],
        created_at: new Date("2021-02-10T16:39:13.064Z"),
      },
    });
    await insertOrganisme({
      siret: "22222222200002",
      _meta: {
        anomalies: [],
        created_at: new Date("2020-02-10T16:39:13.064Z"),
      },
    });

    let response = await httpClient.get("/api/v1/organismes?ordre=desc");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes[0].siret, "11111111100001");
    strictEqual(response.data.organismes[1].siret, "22222222200002");
  });

  it("Vérifie que le service retourne une liste vide quand aucun organisme ne correspond", async () => {
    const { httpClient } = await startServer();

    let response = await httpClient.get("/api/v1/organismes?text=XXX");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      organismes: [],
      pagination: {
        page: 1,
        resultats_par_page: 10,
        nombre_de_page: 1,
        total: 0,
      },
    });
  });

  it("Vérifie que le service retourne une 400 quand les paramètres sont inconnus", async () => {
    const { httpClient } = await startServer();

    let response = await httpClient.get("/api/v1/organismes?invalid=XXX");

    strictEqual(response.status, 400);
    deepStrictEqual(response.data.details[0].path[0], "invalid");
  });

  it("Vérifie que le service retourne une 400 quand les paramètres sont invalides", async () => {
    const { httpClient } = await startServer();

    let response = await httpClient.get("/api/v1/organismes?ordre=-1");

    strictEqual(response.status, 400);
    deepStrictEqual(response.data.details[0].path[0], "ordre");
  });

  it("Vérifie qu'on peut obtenir un organisme", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      _meta: {
        anomalies: [],
        created_at: new Date("2021-02-10T16:39:13.064Z"),
      },
    });

    let response = await httpClient.get("/api/v1/organismes/11111111100001");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      uai_potentiels: [],
      contacts: [],
      relations: [],
      reseaux: [],
      statuts: [],
      lieux_de_formation: [],
      diplomes: [],
      certifications: [],
      siege_social: true,
      etat_administratif: "actif",
      referentiels: ["test"],
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
        label: "31 rue des lilas Paris 75019",
        code_postal: "75001",
        code_insee: "75000",
        localite: "PARIS",
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
      _meta: {
        anomalies: [],
        created_at: "2021-02-10T16:39:13.064Z",
        validation: "INCONNUE",
      },
    });
  });

  it("Vérifie qu'on peut limiter les champs renvoyés pour un organisme", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      _meta: {
        anomalies: [],
        created_at: new Date("2021-02-10T16:39:13.064Z"),
      },
    });

    let response = await httpClient.get("/api/v1/organismes/11111111100001?champs=siret,uai");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      siret: "11111111100001",
    });
  });

  it("Vérifie qu'on peut exclure des champs renvoyés pour un organisme", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      _meta: {
        anomalies: [],
        created_at: new Date("2021-02-10T16:39:13.064Z"),
      },
    });

    let response = await httpClient.get("/api/v1/organismes/11111111100001?champs=-siret,uai");

    strictEqual(response.status, 200);
    strictEqual(response.data.siret, undefined);
    strictEqual(response.data.uai, undefined);
  });

  it("Vérifie qu'on renvoie une 404 si le siret n'est pas connu", async () => {
    const { httpClient } = await startServer();

    let response = await httpClient.get("/api/v1/organismes/11111111100001");

    strictEqual(response.status, 404);
    deepStrictEqual(response.data, {
      error: "Not Found",
      message: "Siret inconnu",
      statusCode: 404,
    });
  });

  it("Vérifie qu'on peut mettre à jour un organisme", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      adresse: {
        region: { code: "11", nom: "Île-de-France" },
      },
    });

    let response = await httpClient.put(
      "/api/v1/organismes/11111111100001/validateUAI",
      { uai: "0751234J" },
      {
        headers: {
          ...generateAuthHeader("region", "11"),
        },
      }
    );

    strictEqual(response.status, 200);
    deepStrictEqual(response.data.siret, "11111111100001");
    deepStrictEqual(response.data.uai, "0751234J");
    deepStrictEqual(omitDeep(response.data, ["created_at"]), {
      siret: "11111111100001",
      uai: "0751234J",
      raison_sociale: "Centre de formation",
      uai_potentiels: [],
      contacts: [],
      relations: [],
      lieux_de_formation: [],
      reseaux: [],
      statuts: [],
      diplomes: [],
      certifications: [],
      siege_social: true,
      etat_administratif: "actif",
      referentiels: ["test"],
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
        label: "31 rue des lilas Paris 75019",
        code_postal: "75001",
        code_insee: "75000",
        localite: "PARIS",
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
      _meta: {
        anomalies: [],
        validation: "VALIDEE",
      },
    });

    let found = await dbCollection("organismes").findOne({ siret: "11111111100001" });
    deepStrictEqual(found.uai, "0751234J");
    let { date, ...modification } = await dbCollection("modifications").findOne({}, { projection: { _id: 0 } });
    assert.ok(date);
    deepStrictEqual(modification, {
      siret: "11111111100001",
      uai: "0751234J",
      auteur: "11",
    });
  });

  it("Vérifie qu'on peut valider une UAI (academie)", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      adresse: {
        academie: { code: "01", nom: "Paris" },
      },
    });

    let response = await httpClient.put(
      "/api/v1/organismes/11111111100001/validateUAI",
      { uai: "0751234J" },
      {
        headers: {
          ...generateAuthHeader("academie", "01"),
        },
      }
    );

    strictEqual(response.status, 200);
    deepStrictEqual(response.data.siret, "11111111100001");
    deepStrictEqual(response.data.uai, "0751234J");
  });

  it("Vérifie qu'on retourne une erreur si l'UAI est liée à un siret inconnu", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      adresse: {
        region: { code: "11", nom: "Île-de-France" },
      },
    });

    let response = await httpClient.put(
      "/api/v1/organismes/22222222200002/validateUAI",
      { uai: "0751234J" },
      {
        headers: {
          ...generateAuthHeader("region", "11"),
        },
      }
    );

    strictEqual(response.status, 400);
  });

  it("Vérifie qu'on retourne une erreur si l'UAI est liée à un siret d'une autre région", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      adresse: {
        region: { code: "76", nom: "Occitanie" },
      },
    });

    let response = await httpClient.put(
      "/api/v1/organismes/22222222200002/validateUAI",
      { uai: "0751234J" },
      {
        headers: {
          ...generateAuthHeader("region", "76"),
        },
      }
    );

    strictEqual(response.status, 400);
  });

  it("Vérifie qu'on retourne une erreur si l'UAI est liée à un siret d'une autre académie", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      adresse: {
        academie: { code: "01", nom: "Paris" },
      },
    });

    let response = await httpClient.put(
      "/api/v1/organismes/22222222200002/validateUAI",
      { uai: "0751234J" },
      {
        headers: {
          ...generateAuthHeader("academie", "11"),
        },
      }
    );

    strictEqual(response.status, 400);
  });
});
