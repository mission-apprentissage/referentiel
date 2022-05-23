const { strictEqual, deepStrictEqual, ok } = require("assert");
const iconv = require("iconv-lite");
const { insertOrganisme } = require("../utils/fakeData");
const { startServer, generateAuthHeader } = require("../utils/testUtils");
const { dbCollection } = require("../../src/common/db/mongodb");
const assert = require("assert");
const { omitDeep } = require("../../src/common/utils/objectUtils");
const { sortBy, omit } = require("lodash");
const { DateTime } = require("luxon");

describe("organismesRoutes", () => {
  it("Vérifie qu'on peut lister des organismes", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      nature: "responsable_formateur",
      raison_sociale: "Centre de formation",
      _meta: {
        anomalies: [],
        date_import: new Date("2021-02-10T16:39:13.064Z"),
      },
    });

    const response = await httpClient.get("/api/v1/organismes");

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
          nature: "responsable_formateur",
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
            date_import: "2021-02-10T16:39:13.064Z",
            nouveau: false,
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

  it("Vérifie qu'on peut rechercher des organismes à partir d'un UAI", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({ uai: "0751234J" });

    const response = await httpClient.get("/api/v1/organismes?uais=0751234J");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].uai, "0751234J");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir de plusieurs UAI", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({ uai: "0751234J" });
    await insertOrganisme({ uai: "0751234X" });

    const response = await httpClient.get("/api/v1/organismes?uais=0751234J,0751234X");

    strictEqual(response.status, 200);
    const organismes = sortBy(response.data.organismes, (o) => o.uai);
    strictEqual(organismes.length, 2);
    strictEqual(organismes[0].uai, "0751234J");
    strictEqual(organismes[1].uai, "0751234X");
  });

  it("Vérifie qu'on peut rechercher des organismes qui ont un UAI", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({ siret: "11111111100006", uai: "0751234J" });
    await insertOrganisme();

    const response = await httpClient.get("/api/v1/organismes?uais=true");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des organismes qui n'ont pas d'UAI", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({ siret: "11111111100006", uai: "0751234J" });
    await insertOrganisme({ siret: "22222222200002" });

    const response = await httpClient.get("/api/v1/organismes?uais=false");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir de leur nda", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({ siret: "11111111100006", numero_declaration_activite: "12345678901" });

    const response = await httpClient.get("/api/v1/organismes?numero_declaration_activite=12345678901");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des organismes qui ont un nda", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({ siret: "11111111100006", numero_declaration_activite: "12345678901" });

    const response = await httpClient.get("/api/v1/organismes?numero_declaration_activite=true");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des organismes qui n'ont pas de nda", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({ siret: "11111111100006", numero_declaration_activite: "12345678901" });
    await insertOrganisme({ siret: "22222222200002" });

    const response = await httpClient.get("/api/v1/organismes?numero_declaration_activite=false");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des organismes qualiopi", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({ qualiopi: false });
    await insertOrganisme({ siret: "11111111100006", qualiopi: true });

    const response = await httpClient.get("/api/v1/organismes?qualiopi=true");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des organismes qui ne sont pas qualiopi", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({ qualiopi: true });
    await insertOrganisme({ siret: "11111111100006", qualiopi: false });

    const response = await httpClient.get("/api/v1/organismes?qualiopi=false");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des organismes actifs", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({ siret: "11111111100006", etat_administratif: "actif" });
    await insertOrganisme({ etat_administratif: "fermé" });

    const response = await httpClient.get("/api/v1/organismes?etat_administratif=actif");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des organismes fermés", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({ siret: "11111111100006", etat_administratif: "fermé" });
    await insertOrganisme({ etat_administratif: "actif" });

    const response = await httpClient.get("/api/v1/organismes?etat_administratif=fermé");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on calcule le meilleur UAI probable", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100006",
      uai_potentiels: [
        {
          sources: ["sifa-ramsese"],
          uai: "0751234J",
        },
        {
          sources: ["other"],
          uai: "0751234X",
        },
      ],
    });

    const response = await httpClient.get("/api/v1/organismes");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes[0]._meta.uai_probable, "0751234J");
  });

  it("Vérifie qu'on peut rechercher des organismes qui un uai potentiel particulier", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100006",
      uai_potentiels: [
        {
          sources: ["dummy"],
          uai: "0751234J",
        },
      ],
    });
    await insertOrganisme({ siret: "22222222200002" });

    const response = await httpClient.get("/api/v1/organismes?uai_potentiels=0751234J");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des organismes avec plusieurs uai potentiels", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100006",
      uai_potentiels: [
        {
          sources: ["dummy"],
          uai: "0751234J",
        },
      ],
    });
    await insertOrganisme({
      siret: "22222222200002",
      uai_potentiels: [
        {
          sources: ["dummy"],
          uai: "0751234X",
        },
      ],
    });
    await insertOrganisme({ siret: "33333333300003" });

    const response = await httpClient.get("/api/v1/organismes?uai_potentiels=0751234J,0751234X");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 2);
    ok(response.data.organismes.find((o) => o.siret === "11111111100006"));
    ok(response.data.organismes.find((o) => o.siret === "22222222200002"));
  });

  it("Vérifie qu'on peut rechercher des organismes qui ont des uais potentiels", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100006",
      uai_potentiels: [
        {
          sources: ["dummy"],
          uai: "0751234J",
        },
      ],
    });
    await insertOrganisme();

    const response = await httpClient.get("/api/v1/organismes?uai_potentiels=true");

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
        },
      ],
    });
    await insertOrganisme({ siret: "22222222200002" });

    const response = await httpClient.get("/api/v1/organismes?uai_potentiels=false");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des organismes qui un type de relation", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100006",
      relations: [
        {
          type: "responsable->formateur",
          siret: "33333333300003",
          label: "Organisme de formation",
          sources: ["aSource"],
          referentiel: false,
        },
      ],
    });
    await insertOrganisme({ siret: "22222222200002" });

    const response = await httpClient.get("/api/v1/organismes?relations=responsable->formateur");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des organismes avec plusieurs type de relations", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100006",
      relations: [
        {
          type: "responsable->formateur",
          siret: "33333333300003",
          label: "Organisme de formation",
          sources: ["aSource"],
          referentiel: false,
        },
      ],
    });
    await insertOrganisme({
      siret: "22222222200002",
      relations: [
        {
          type: "formateur->responsable",
          siret: "44444444400004",
          label: "Organisme de formation",
          sources: ["aSource"],
          referentiel: false,
        },
      ],
    });
    await insertOrganisme({ siret: "55555555500005" });

    const response = await httpClient.get("/api/v1/organismes?relations=responsable->formateur,formateur->responsable");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 2);
    ok(response.data.organismes.find((o) => o.siret === "11111111100006"));
    ok(response.data.organismes.find((o) => o.siret === "22222222200002"));
  });

  it("Vérifie qu'on peut rechercher des organismes qui ont des relations", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100006",
      relations: [
        {
          type: "responsable->formateur",
          siret: "33333333300003",
          label: "Organisme de formation",
          sources: ["aSource"],
          referentiel: false,
        },
      ],
    });
    await insertOrganisme();

    const response = await httpClient.get("/api/v1/organismes?relations=true");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des organismes qui n'ont pas de relations", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100006",
      relations: [
        {
          type: "responsable->formateur",
          siret: "33333333300003",
          label: "Organisme de formation",
          sources: ["aSource"],
          referentiel: false,
        },
      ],
    });
    await insertOrganisme({ siret: "22222222200002" });

    const response = await httpClient.get("/api/v1/organismes?relations=false");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir d'un siret", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({ siret: "11111111100001" });

    const response = await httpClient.get("/api/v1/organismes?sirets=11111111100001");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir de plusieurs sirets", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({ siret: "11111111100001" });
    await insertOrganisme({ siret: "22222222200002" });
    await insertOrganisme({ siret: "33333333300003" });

    const response = await httpClient.get("/api/v1/organismes?sirets=11111111100001,22222222200002");

    strictEqual(response.status, 200);
    const organismes = sortBy(response.data.organismes, (o) => o.siret);
    strictEqual(organismes.length, 2);
    strictEqual(organismes[0].siret, "11111111100001");
    strictEqual(organismes[1].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des organismes en fulltext (uai)", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({
      uai: "0010856A",
    });

    const response = await httpClient.get("/api/v1/organismes?text=0010856A");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes[0].uai, "0010856A");
  });

  it("Vérifie qu'on peut rechercher des organismes en fulltext (siret)", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({
      siret: "11111111100001",
    });

    const response = await httpClient.get("/api/v1/organismes?text=11111111100001");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir d'une académie", async () => {
    const { httpClient } = await startServer();
    await Promise.all([
      insertOrganisme({
        siret: "11111111100001",
        adresse: {
          academie: { code: "01", nom: "Paris" },
        },
      }),
      insertOrganisme({
        siret: "22222222200002",
        adresse: {
          academie: { code: "02", nom: "Aix-Marseille" },
        },
      }),
    ]);

    const response = await httpClient.get("/api/v1/organismes?academies=01");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des organismes qui n'ont pas d'académie", async () => {
    const { httpClient } = await startServer();
    await Promise.all([
      insertOrganisme(
        {
          siret: "11111111100001",
        },
        (o) => omit(o, ["adresse"])
      ),
      insertOrganisme(),
    ]);

    const response = await httpClient.get("/api/v1/organismes?academies=false");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des organismes qui ont une académie", async () => {
    const { httpClient } = await startServer();
    await Promise.all([insertOrganisme({ siret: "11111111100001" }), insertOrganisme({}, (o) => omit(o, ["adresse"]))]);

    const response = await httpClient.get("/api/v1/organismes?academies=true");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir de plusieurs académies", async () => {
    const { httpClient } = await startServer();
    await Promise.all([
      insertOrganisme({
        siret: "11111111100001",
        adresse: {
          academie: { code: "01", nom: "Paris" },
        },
      }),
      insertOrganisme({
        siret: "22222222200002",
        adresse: {
          academie: { code: "16", nom: "Toulouse" },
        },
      }),
      insertOrganisme({
        siret: "33333333300003",
        adresse: {
          academie: { code: "02", nom: "Aix-Marseille" },
        },
      }),
    ]);

    const response = await httpClient.get("/api/v1/organismes?academies=01,16");

    strictEqual(response.status, 200);
    const organismes = sortBy(response.data.organismes, (o) => o.siret);
    strictEqual(organismes.length, 2);
    strictEqual(organismes[0].siret, "11111111100001");
    strictEqual(organismes[1].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir d'une région", async () => {
    const { httpClient } = await startServer();
    await Promise.all([
      insertOrganisme({
        siret: "11111111100001",
        adresse: {
          region: { code: "11", nom: "Île-de-France" },
        },
      }),
      insertOrganisme({
        siret: "22222222200002",
        adresse: {
          region: { code: "93", nom: "Provence-Alpes-Côte d'Azur" },
        },
      }),
    ]);

    const response = await httpClient.get("/api/v1/organismes?regions=11");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir de plusieurs régions", async () => {
    const { httpClient } = await startServer();
    await Promise.all([
      insertOrganisme({
        siret: "11111111100001",
        adresse: {
          region: { code: "11", nom: "Île-de-France" },
        },
      }),
      insertOrganisme({
        siret: "22222222200002",
        adresse: {
          region: { code: "76", nom: "Occitanie" },
        },
      }),
      insertOrganisme({
        siret: "33333333300003",
        adresse: {
          region: { code: "93", nom: "Provence-Alpes-Côte d'Azur" },
        },
      }),
    ]);

    const response = await httpClient.get("/api/v1/organismes?regions=11,76");

    strictEqual(response.status, 200);
    const organismes = sortBy(response.data.organismes, (o) => o.siret);
    strictEqual(organismes.length, 2);
    strictEqual(organismes[0].siret, "11111111100001");
    strictEqual(organismes[1].siret, "22222222200002");
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

    const response = await httpClient.get("/api/v1/organismes?departements=11");

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

    const response = await httpClient.get("/api/v1/organismes?departements=11,75");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 2);
  });

  it("Vérifie qu'on peut rechercher des organismes à partir d'une nature", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      nature: "responsable",
    });
    await insertOrganisme({
      siret: "22222222200002",
      nature: "formateur",
    });

    const response = await httpClient.get("/api/v1/organismes?natures=formateur");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "22222222200002");
  });

  it("Vérifie qu'on peut rechercher des organismes responsable_formateur à partir de leur nature", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      nature: "responsable_formateur",
    });
    await insertOrganisme({
      siret: "22222222200002",
      nature: "formateur",
    });

    const response = await httpClient.get("/api/v1/organismes?natures=responsable_formateur");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100001");
  });

  it("Vérifie qu'on peut rechercher des organismes à partir de plusieurs natures", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      nature: "responsable",
    });
    await insertOrganisme({
      siret: "22222222200002",
      nature: "responsable_formateur",
    });
    await insertOrganisme({
      siret: "333333333000003",
      nature: "formateur",
    });

    const response = await httpClient.get("/api/v1/organismes?natures=formateur,responsable");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 2);
    ok(response.data.organismes.find((o) => o.siret === "11111111100001"));
    ok(response.data.organismes.find((o) => o.siret === "333333333000003"));
  });

  it("Vérifie qu'on peut rechercher des organismes avec un référentiel dans lequel ils apparaissent", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      referentiels: ["ref1"],
    });
    await insertOrganisme({
      siret: "22222222200002",
      referentiels: ["ref2"],
    });
    const response = await httpClient.get("/api/v1/organismes?referentiels=ref1");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    ok(response.data.organismes.find((o) => o.siret === "11111111100001"));
  });

  it("Vérifie qu'on peut rechercher des organismes avec des référentiels dans lequel ils apparaissent", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      referentiels: ["ref1"],
    });
    await insertOrganisme({
      siret: "22222222200002",
      referentiels: ["ref2"],
    });
    await insertOrganisme({
      siret: "333333333000003",
      referentiels: ["ref3"],
    });

    const response = await httpClient.get("/api/v1/organismes?referentiels=ref1,ref3");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 2);
    ok(response.data.organismes.find((o) => o.siret === "11111111100001"));
    ok(response.data.organismes.find((o) => o.siret === "333333333000003"));
  });

  it("Vérifie qu'on peut rechercher des organismes qui n'apparaissent pas dans un référentiel", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      referentiels: ["ref1"],
    });
    await insertOrganisme({
      siret: "22222222200002",
      referentiels: ["ref2"],
    });
    await insertOrganisme({
      siret: "333333333000003",
      referentiels: ["ref3"],
    });

    const response = await httpClient.get("/api/v1/organismes?referentiels=-ref2,ref1");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    ok(response.data.organismes.find((o) => o.siret === "11111111100001"));
  });

  it("Vérifie qu'on peut limiter les champs renvoyés pour la liste des organismes", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      _meta: {
        anomalies: [],
        date_import: new Date("2021-02-10T16:39:13.064Z"),
      },
    });

    const response = await httpClient.get("/api/v1/organismes?champs=siret,raison_sociale");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      organismes: [
        {
          siret: "11111111100001",
          raison_sociale: "Centre de formation",
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
              key: "123456",
              type: "dummy",
              sources: ["test"],
              job: "collect",
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
        date_import: new Date("2021-02-10T16:39:13.064Z"),
      },
    });
    await insertOrganisme({
      siret: "22222222200002",
      _meta: {
        anomalies: [],
        date_import: new Date("2020-02-10T16:39:13.064Z"),
      },
    });

    const response = await httpClient.get("/api/v1/organismes?ordre=asc");

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
        date_import: new Date("2021-02-10T16:39:13.064Z"),
      },
    });
    await insertOrganisme({
      siret: "22222222200002",
      _meta: {
        anomalies: [],
        date_import: new Date("2020-02-10T16:39:13.064Z"),
      },
    });

    const response = await httpClient.get("/api/v1/organismes?ordre=desc");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes[0].siret, "11111111100001");
    strictEqual(response.data.organismes[1].siret, "22222222200002");
  });

  it("Vérifie que le service retourne une liste vide quand aucun organisme ne correspond", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api/v1/organismes?text=XXX");

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

    const response = await httpClient.get("/api/v1/organismes?invalid=XXX");

    strictEqual(response.status, 400);
    deepStrictEqual(response.data.details[0].path[0], "invalid");
  });

  it("Vérifie que le service retourne une 400 quand les paramètres sont invalides", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api/v1/organismes?ordre=-1");

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
        date_import: new Date("2021-02-10T16:39:13.064Z"),
      },
    });

    const response = await httpClient.get("/api/v1/organismes/11111111100001");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
      nature: "inconnue",
      uai_potentiels: [],
      contacts: [],
      relations: [],
      reseaux: [],
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
        date_import: "2021-02-10T16:39:13.064Z",
        nouveau: false,
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
        date_import: new Date("2021-02-10T16:39:13.064Z"),
      },
    });

    const response = await httpClient.get("/api/v1/organismes/11111111100001?champs=siret,raison_sociale");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      siret: "11111111100001",
      raison_sociale: "Centre de formation",
    });
  });

  it("Vérifie qu'on renvoie une 404 si le siret n'est pas connu", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api/v1/organismes/11111111100001");

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
      uai: "0751234X",
      raison_sociale: "Centre de formation",
      adresse: {
        region: { code: "11", nom: "Île-de-France" },
      },
    });

    const response = await httpClient.put(
      "/api/v1/organismes/11111111100001/setUAI",
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
    deepStrictEqual(
      omitDeep(response.data, () => ["date_import"]),
      {
        siret: "11111111100001",
        uai: "0751234J",
        nature: "inconnue",
        raison_sociale: "Centre de formation",
        uai_potentiels: [],
        contacts: [],
        relations: [],
        lieux_de_formation: [],
        reseaux: [],
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
          nouveau: false,
        },
      }
    );

    const found = await dbCollection("organismes").findOne({ siret: "11111111100001" });
    deepStrictEqual(found.uai, "0751234J");
    const { date, ...modification } = await dbCollection("modifications").findOne({}, { projection: { _id: 0 } });
    assert.ok(date);
    deepStrictEqual(modification, {
      siret: "11111111100001",
      auteur: "region-11",
      original: {
        uai: "0751234X",
      },
      changements: {
        uai: "0751234J",
      },
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

    const response = await httpClient.put(
      "/api/v1/organismes/11111111100001/setUAI",
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

    const response = await httpClient.put(
      "/api/v1/organismes/22222222200002/setUAI",
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

    const response = await httpClient.put(
      "/api/v1/organismes/22222222200002/setUAI",
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

    const response = await httpClient.put(
      "/api/v1/organismes/22222222200002/setUAI",
      { uai: "0751234J" },
      {
        headers: {
          ...generateAuthHeader("academie", "11"),
        },
      }
    );

    strictEqual(response.status, 400);
  });

  it("Vérifie qu'on peut rechercher des nouveaux organismes", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100006",
      _meta: {
        date_import: new Date(),
      },
    });
    await insertOrganisme({
      siret: "22222222200006",
      _meta: {
        date_import: DateTime.fromISO("1999-03-01").toJSDate(),
      },
    });

    const response = await httpClient.get("/api/v1/organismes?nouveaux=true");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "11111111100006");
  });

  it("Vérifie qu'on peut rechercher des anciens organismes", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100006",
      _meta: {
        date_import: new Date(),
      },
    });
    await insertOrganisme({
      siret: "22222222200006",
      _meta: {
        date_import: DateTime.fromISO("1999-03-01").toJSDate(),
      },
    });

    const response = await httpClient.get("/api/v1/organismes?nouveaux=false");

    strictEqual(response.status, 200);
    strictEqual(response.data.organismes.length, 1);
    strictEqual(response.data.organismes[0].siret, "22222222200006");
  });

  it("Vérifie qu'on peut obtenir les résultats au format CSV", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100006",
      raison_sociale: "Centre de formation",
      uai_potentiels: [
        {
          sources: ["dummy"],
          uai: "0751234J",
        },
        {
          sources: ["sifa-ramsese"],
          uai: "0751234X",
        },
      ],
      _meta: {
        date_import: DateTime.fromISO("2022-03-20").toJSDate(),
      },
    });

    const response = await httpClient.get("/api/v1/organismes.csv");

    strictEqual(response.status, 200);
    strictEqual(
      response.data,
      `Siret;UAI validée;Raison sociale;Enseigne;numero_declaration_activite;etat_administratif;Nature;Adresse;Académie;Région;Qualiopi;Réseaux;Nombre de relations;Nombre de lieux de formation;Date d'import;UAI probable;UAI potentielle 1;UAI potentielle 2;UAI potentielle 3;UAI potentielle 4;UAI potentielle 5;UAI potentielle 6;UAI potentielle 7;UAI potentielle 8;UAI potentielle 9;UAI potentielle 10;UAI potentielle 11;UAI potentielle 12;UAI potentielle 13;UAI potentielle 14;UAI potentielle 15;UAI potentielle 16;UAI potentielle 17;UAI potentielle 18;UAI potentielle 19;UAI potentielle 20;UAI potentielle 21;UAI potentielle 22;UAI potentielle 23;UAI potentielle 24;UAI potentielle 25;UAI potentielle 26;UAI potentielle 27;UAI potentielle 28;UAI potentielle 29;UAI potentielle 30;UAI potentielle 31;UAI potentielle 32;UAI potentielle 33;UAI potentielle 34;UAI potentielle 35;UAI potentielle 36;UAI potentielle 37;UAI potentielle 38;UAI potentielle 39;UAI potentielle 40;UAI potentielle 41;UAI potentielle 42;UAI potentielle 43;UAI potentielle 44;UAI potentielle 45;UAI potentielle 46;UAI potentielle 47;UAI potentielle 48;UAI potentielle 49;UAI potentielle 50;UAI potentielle 51;UAI potentielle 52;UAI potentielle 53;UAI potentielle 54;UAI potentielle 55;UAI potentielle 56;UAI potentielle 57;UAI potentielle 58;UAI potentielle 59;UAI potentielle 60
11111111100006;;Centre de formation;;;actif;inconnue;31 rue des lilas Paris 75019;Paris;Île-de-France;Non;;0;0;2022-03-20;0751234X;0751234J;0751234X;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
`
    );
  });

  it("Vérifie qu'on peut obtenir les résultats au format CSV (compatible XLS)", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100006",
      raison_sociale: "Centre de formation",
      uai_potentiels: [
        {
          sources: ["dummy"],
          uai: "0751234J",
        },
        {
          sources: ["sifa-ramsese"],
          uai: "0751234X",
        },
      ],
      _meta: {
        date_import: DateTime.fromISO("2022-03-20").toJSDate(),
      },
    });

    const response = await httpClient.get("/api/v1/organismes.xls");

    strictEqual(response.status, 200);
    const decoded = iconv.decode(response.data, "UTF-16");
    assert.ok(decoded.indexOf('="Siret"\t') !== -1);
  });

  it("Vérifie qu'on peut chercher des organismes via la méthode POST", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({ siret: "11111111100001" });
    await insertOrganisme({ siret: "22222222200006" });

    const response = await httpClient.post("/api/v1/organismes", { sirets: "11111111100001", champs: "siret" });

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      organismes: [{ siret: "11111111100001" }],
      pagination: {
        page: 1,
        resultats_par_page: 10,
        nombre_de_page: 1,
        total: 1,
      },
    });
  });
});
