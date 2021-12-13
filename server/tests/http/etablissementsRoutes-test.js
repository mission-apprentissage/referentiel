const { strictEqual, deepStrictEqual } = require("assert");
const { insertEtablissement } = require("../utils/fakeData");
const { startServer, generateAuthHeader } = require("../utils/testUtils");
const { dbCollection } = require("../../src/common/db/mongodb");
const assert = require("assert");

describe("etablissementsRoutes", () => {
  it("Vérifie qu'on peut lister des établissements", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100001",
      statuts: ["gestionnaire", "formateur"],
      raison_sociale: "Centre de formation",
      _meta: {
        anomalies: [],
        created_at: new Date("2021-02-10T16:39:13.064Z"),
      },
    });

    let response = await httpClient.get("/api/v1/etablissements");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      etablissements: [
        {
          siret: "11111111100001",
          raison_sociale: "Centre de formation",
          uais: [],
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
          conformite_reglementaire: {
            conventionne: true,
          },
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
          },
        },
      ],
      filtres: {
        departements: [{ code: "75", label: "Paris", nombre_de_resultats: 1 }],
        statuts: [
          { code: "formateur", label: "UFA", nombre_de_resultats: 1 },
          { code: "gestionnaire", label: "OF-CFA", nombre_de_resultats: 1 },
        ],
      },
      pagination: {
        page: 1,
        resultats_par_page: 10,
        nombre_de_page: 1,
        total: 1,
      },
    });
  });

  it("Vérifie qu'on peut rechercher des établissements à partir d'un uai validé", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement();
    await insertEtablissement({ siret: "11111111100006", uai: "0751234J" });

    let response = await httpClient.get("/api/v1/etablissements?uai=0751234J");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements.length, 1);
    strictEqual(response.data.etablissements[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des établissements qui ont un uai", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({ siret: "11111111100006", uai: "0751234J" });
    await insertEtablissement();

    let response = await httpClient.get("/api/v1/etablissements?uai=true");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements.length, 1);
    strictEqual(response.data.etablissements[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des établissements qui n'ont pas d'uai", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({ siret: "11111111100006", uai: "0751234J" });
    await insertEtablissement({ siret: "22222222200002" });

    let response = await httpClient.get("/api/v1/etablissements?uai=false");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements.length, 1);
    strictEqual(response.data.etablissements[0].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des établissements qui ont des uais potentiels", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100006",
      uais: [
        {
          sources: ["dummy"],
          uai: "0751234J",
          valide: true,
        },
      ],
    });
    await insertEtablissement();

    let response = await httpClient.get("/api/v1/etablissements?potentiel=true");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements.length, 1);
    strictEqual(response.data.etablissements[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des établissements qui n'ont pas uais potentiels", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100006",
      uais: [
        {
          sources: ["dummy"],
          uai: "0751234J",
          valide: true,
        },
      ],
    });
    await insertEtablissement({ siret: "22222222200002" });

    let response = await httpClient.get("/api/v1/etablissements?potentiel=false");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements.length, 1);
    strictEqual(response.data.etablissements[0].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des établissements qui un uai potentiel particulier", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100006",
      uais: [
        {
          sources: ["dummy"],
          uai: "0751234J",
          valide: true,
        },
      ],
    });
    await insertEtablissement({ siret: "22222222200002" });

    let response = await httpClient.get("/api/v1/etablissements?potentiel=0751234J");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements.length, 1);
    strictEqual(response.data.etablissements[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des établissements à partir d'un siret", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement();
    await insertEtablissement({
      siret: "11111111100001",
    });

    let response = await httpClient.get("/api/v1/etablissements?siret=11111111100001");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des établissements à partir d'un siren", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement();
    await insertEtablissement({
      siret: "11111111100001",
    });

    let response = await httpClient.get("/api/v1/etablissements?siret=11111111100001");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des établissements à partir d'un uai (fulltext)", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement();
    await insertEtablissement({
      uai: "0010856A",
    });

    let response = await httpClient.get("/api/v1/etablissements?text=0010856A");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements[0].uai, "0010856A");
  });

  it("Vérifie qu'on peut rechercher des établissements à partir d'un siret (fulltext)", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement();
    await insertEtablissement({
      siret: "11111111100001",
    });

    let response = await httpClient.get("/api/v1/etablissements?text=11111111100001");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des établissements à partir d'une académie", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100001",
      adresse: {
        academie: { code: "01", nom: "Paris" },
      },
    });
    await insertEtablissement({
      siret: "22222222200002",
      adresse: {
        academie: { code: "02", nom: "Aix-Marseille" },
      },
    });

    let response = await httpClient.get("/api/v1/etablissements?academie=01");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements.length, 1);
    strictEqual(response.data.etablissements[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des établissements à partir d'une région", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100001",
      adresse: {
        region: { code: "11", nom: "Île-de-France" },
      },
    });
    await insertEtablissement({
      siret: "22222222200002",
      adresse: {
        region: { code: "93", nom: "Provence-Alpes-Côte d'Azur" },
      },
    });

    let response = await httpClient.get("/api/v1/etablissements?region=11");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements.length, 1);
    strictEqual(response.data.etablissements[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut trier les établissements par nombre de relations", async () => {
    const { httpClient } = await startServer();
    await Promise.all([
      insertEtablissement({
        siret: "11111111100001",
        relations: [
          {
            siret: "22222222200002",
            label: "NOMAYO",
            referentiel: true,
            sources: ["test"],
          },
        ],
      }),
      insertEtablissement({
        siret: "33333333300008",
        relations: [
          {
            siret: "11111111100001",
            label: "NOMAYO",
            referentiel: true,
            sources: ["test"],
          },
          {
            siret: "22222222200002",
            label: "NOMAYO",
            referentiel: true,
            sources: ["test"],
          },
        ],
      }),
    ]);

    let response = await httpClient.get("/api/v1/etablissements?tri=relations&ordre=desc");
    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements[0].siret, "33333333300008");
    strictEqual(response.data.etablissements[1].siret, "11111111100001");

    response = await httpClient.get("/api/v1/etablissements?tri=relations&ordre=asc");
    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements[0].siret, "11111111100001");
    strictEqual(response.data.etablissements[1].siret, "33333333300008");
  });

  it("Vérifie qu'on peut trier les établissements par nombre d'uais secondaires", async () => {
    const { httpClient } = await startServer();
    await Promise.all([
      insertEtablissement({
        siret: "11111111100001",
        uais: [
          {
            sources: ["catalogue"],
            uai: "1111111S",
            valide: true,
          },
        ],
      }),
      insertEtablissement({
        siret: "33333333300008",
        uais: [
          {
            sources: ["catalogue"],
            uai: "1111111S",
            valide: true,
          },
          {
            sources: ["catalogue"],
            uai: "2222222S",
            valide: true,
          },
        ],
      }),
    ]);

    let response = await httpClient.get("/api/v1/etablissements?tri=uais&ordre=desc");
    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements[0].siret, "33333333300008");
    strictEqual(response.data.etablissements[1].siret, "11111111100001");

    response = await httpClient.get("/api/v1/etablissements?tri=uais&ordre=asc");
    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements[0].siret, "11111111100001");
    strictEqual(response.data.etablissements[1].siret, "33333333300008");
  });

  it("Vérifie qu'on peut rechercher des établissements à partir de leur département", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100001",
      adresse: {
        departement: { code: "75", nom: "Paris" },
      },
    });
    await insertEtablissement({
      siret: "22222222200002",
      adresse: {
        departement: { code: "11", nom: "Aude" },
      },
    });

    let response = await httpClient.get("/api/v1/etablissements?departements=11");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements.length, 1);
    strictEqual(response.data.etablissements[0].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des établissements à partir de plusieurs départements", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100001",
      adresse: {
        departement: { code: "75", nom: "Paris" },
      },
    });
    await insertEtablissement({
      siret: "22222222200002",
      adresse: {
        departement: { code: "11", nom: "Aude" },
      },
    });

    let response = await httpClient.get("/api/v1/etablissements?departements=11,75");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements.length, 2);
  });

  it("Vérifie qu'on peut rechercher des établissements à partir de son statut", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100001",
      statuts: ["gestionnaire"],
    });
    await insertEtablissement({
      siret: "22222222200002",
      statuts: ["formateur"],
    });

    let response = await httpClient.get("/api/v1/etablissements?statuts=formateur");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements.length, 1);
    strictEqual(response.data.etablissements[0].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des établissements à partir de plusieurs statuts", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100001",
      statuts: ["gestionnaire"],
    });
    await insertEtablissement({
      siret: "22222222200002",
      statuts: ["formateur"],
    });

    let response = await httpClient.get("/api/v1/etablissements?statuts=formateur,gestionnaire");

    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements.length, 2);
  });

  it("Vérifie qu'on peut limiter les champs renvoyés pour la liste des établissements", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      _meta: {
        anomalies: [],
        created_at: new Date("2021-02-10T16:39:13.064Z"),
      },
    });

    let response = await httpClient.get("/api/v1/etablissements?champs=siret,uai");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      etablissements: [
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
      filtres: {
        departements: [{ code: "75", label: "Paris", nombre_de_resultats: 1 }],
        statuts: [],
      },
    });
  });

  it("Vérifie qu'on peut peut limiter le établissement par page", async () => {
    const { httpClient } = await startServer();
    await Promise.all([
      insertEtablissement({ siret: "11111111100001" }),
      insertEtablissement({ siret: "22222222200002" }),
      insertEtablissement({ siret: "33333333300008" }),
    ]);

    let response = await httpClient.get("/api/v1/etablissements?items_par_page=1&page=1");
    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements.length, 1);

    response = await httpClient.get("/api/v1/etablissements?items_par_page=1&page=2");
    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements.length, 1);
  });

  it("Vérifie qu'on peut filtrer les établissements avec des anomalies", async () => {
    const { httpClient } = await startServer();
    await Promise.all([
      insertEtablissement({
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
      insertEtablissement({
        siret: "333333333000083",
      }),
    ]);

    let response = await httpClient.get("/api/v1/etablissements?anomalies=true");
    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements[0].siret, "11111111100001");

    response = await httpClient.get("/api/v1/etablissements?anomalies=false");
    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements[0].siret, "333333333000083");

    response = await httpClient.get("/api/v1/etablissements");
    strictEqual(response.status, 200);
    strictEqual(response.data.etablissements.length, 2);
  });

  it("Vérifie que le service retourne une liste vide quand aucun etablissement ne correspond", async () => {
    const { httpClient } = await startServer();

    let response = await httpClient.get("/api/v1/etablissements?text=XXX");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      etablissements: [],
      pagination: {
        page: 1,
        resultats_par_page: 10,
        nombre_de_page: 1,
        total: 0,
      },
      filtres: {
        departements: [],
        statuts: [],
      },
    });
  });

  it("Vérifie que le service retourne une 400 quand les paramètres sont inconnus", async () => {
    const { httpClient } = await startServer();

    let response = await httpClient.get("/api/v1/etablissements?invalid=XXX");

    strictEqual(response.status, 400);
    deepStrictEqual(response.data.details[0].path[0], "invalid");
  });

  it("Vérifie que le service retourne une 400 quand les paramètres sont invalides", async () => {
    const { httpClient } = await startServer();

    let response = await httpClient.get("/api/v1/etablissements?ordre=-1");

    strictEqual(response.status, 400);
    deepStrictEqual(response.data.details[0].path[0], "ordre");
  });

  it("Vérifie qu'on peut obtenir un établissement", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
    });

    let response = await httpClient.get("/api/v1/etablissements/11111111100001");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      uais: [],
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
      conformite_reglementaire: {
        conventionne: true,
      },
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
    });
  });

  it("Vérifie qu'on peut limiter les champs renvoyés pour un établissement", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      _meta: {
        anomalies: [],
        created_at: new Date("2021-02-10T16:39:13.064Z"),
      },
    });

    let response = await httpClient.get("/api/v1/etablissements/11111111100001?champs=siret,uai");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      siret: "11111111100001",
    });
  });

  it("Vérifie qu'on peut exclure des champs renvoyés pour un établissement", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      _meta: {
        anomalies: [],
        created_at: new Date("2021-02-10T16:39:13.064Z"),
      },
    });

    let response = await httpClient.get("/api/v1/etablissements/11111111100001?champs=-siret,uai");

    strictEqual(response.status, 200);
    strictEqual(response.data.siret, undefined);
    strictEqual(response.data.uai, undefined);
  });

  it("Vérifie qu'on renvoie une 404 si le siret n'est pas connu", async () => {
    const { httpClient } = await startServer();

    let response = await httpClient.get("/api/v1/etablissements/11111111100001");

    strictEqual(response.status, 404);
    deepStrictEqual(response.data, {
      error: "Not Found",
      message: "Siret inconnu",
      statusCode: 404,
    });
  });

  it("Vérifie qu'on peut valider une UAI (region)", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      adresse: {
        region: { code: "11", nom: "Île-de-France" },
      },
    });

    let response = await httpClient.put(
      "/api/v1/etablissements/11111111100001/validateUAI",
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
    let found = await dbCollection("etablissements").findOne({ siret: "11111111100001" });
    deepStrictEqual(found.uai, "0751234J");
    let { _meta, _id, ...modification } = await dbCollection("modifications").findOne();
    assert.ok(_id);
    assert.ok(_meta.created_at);
    deepStrictEqual(modification, {
      siret: "11111111100001",
      uai: "0751234J",
    });
  });

  it("Vérifie qu'on peut valider une UAI (region)", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      adresse: {
        region: { code: "11", nom: "Île-de-France" },
      },
    });

    let response = await httpClient.put(
      "/api/v1/etablissements/11111111100001/validateUAI",
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
    let found = await dbCollection("etablissements").findOne({ siret: "11111111100001" });
    deepStrictEqual(found.uai, "0751234J");
    let { _meta, _id, ...modification } = await dbCollection("modifications").findOne();
    assert.ok(_id);
    assert.ok(_meta.created_at);
    deepStrictEqual(modification, {
      siret: "11111111100001",
      uai: "0751234J",
    });
  });

  it("Vérifie qu'on peut valider une UAI (academie)", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      adresse: {
        academie: { code: "01", nom: "Paris" },
      },
    });

    let response = await httpClient.put(
      "/api/v1/etablissements/11111111100001/validateUAI",
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
    await insertEtablissement({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      adresse: {
        region: { code: "11", nom: "Île-de-France" },
      },
    });

    let response = await httpClient.put(
      "/api/v1/etablissements/22222222200002/validateUAI",
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
    await insertEtablissement({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      adresse: {
        region: { code: "76", nom: "Occitanie" },
      },
    });

    let response = await httpClient.put(
      "/api/v1/etablissements/22222222200002/validateUAI",
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
    await insertEtablissement({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      adresse: {
        academie: { code: "01", nom: "Paris" },
      },
    });

    let response = await httpClient.put(
      "/api/v1/etablissements/22222222200002/validateUAI",
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
