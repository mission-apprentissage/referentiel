const { strictEqual, deepStrictEqual } = require("assert");
const { insertDatagouv } = require("../utils/fakeData");
const { startServer } = require("../utils/testUtils");

describe("datagouvRoutes", () => {
  it("Vérifie qu'on peut lister les organismes déclarés dans datagouv", async () => {
    const { httpClient } = await startServer();
    await insertDatagouv({
      siren: "111111111",
      siretEtablissementDeclarant: "11111111100006",
      numeroDeclarationActivite: "52318107632",
    });

    const response = await httpClient.get("/api/v1/datagouv");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      organismes: [
        {
          siren: "111111111",
          siretEtablissementDeclarant: "11111111100006",
          numeroDeclarationActivite: "52318107632",
          adressePhysiqueOrganismeFormation: {
            codePostal: "75001",
            codeRegion: "11",
            ville: "PARIS",
            voie: "RUE DES LILAS",
          },
          certifications: {
            VAE: "false",
            actionsDeFormation: true,
            actionsDeFormationParApprentissage: false,
            bilansDeCompetences: false,
          },
          denomination: "OF",
          informationsDeclarees: {
            dateDerniereDeclaration: "2020-12-02T23:00:00.000Z",
            debutExercice: "2020-10-31T23:00:00.000Z",
            effectifFormateurs: 0,
            finExercice: "2021-12-30T23:00:00.000Z",
            nbStagiaires: 3,
            nbStagiairesConfiesParUnAutreOF: 3,
            specialitesDeFormation: {
              codeSpecialite1: "312",
              libelleSpecialite1: "Commerce, vente",
            },
          },
          numerosDeclarationActivitePrecedent: "12345678900",
          organismeEtrangerRepresente: {},
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

  it("Vérifie qu'on peut lister obtenir un organisme", async () => {
    const { httpClient } = await startServer();
    await insertDatagouv({
      siren: "111111111",
      siretEtablissementDeclarant: "11111111100006",
      numeroDeclarationActivite: "52318107632",
    });

    const response = await httpClient.get("/api/v1/datagouv/11111111100006");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      siren: "111111111",
      siretEtablissementDeclarant: "11111111100006",
      numeroDeclarationActivite: "52318107632",
      adressePhysiqueOrganismeFormation: {
        codePostal: "75001",
        codeRegion: "11",
        ville: "PARIS",
        voie: "RUE DES LILAS",
      },
      certifications: {
        VAE: "false",
        actionsDeFormation: true,
        actionsDeFormationParApprentissage: false,
        bilansDeCompetences: false,
      },
      denomination: "OF",
      informationsDeclarees: {
        dateDerniereDeclaration: "2020-12-02T23:00:00.000Z",
        debutExercice: "2020-10-31T23:00:00.000Z",
        effectifFormateurs: 0,
        finExercice: "2021-12-30T23:00:00.000Z",
        nbStagiaires: 3,
        nbStagiairesConfiesParUnAutreOF: 3,
        specialitesDeFormation: {
          codeSpecialite1: "312",
          libelleSpecialite1: "Commerce, vente",
        },
      },
      numerosDeclarationActivitePrecedent: "12345678900",
      organismeEtrangerRepresente: {},
    });
  });

  it("Vérifie qu'on renvoie une 400 pour un siret invalide", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api/v1/datagouv/INVALID");

    strictEqual(response.status, 400);
    deepStrictEqual(response.data, {
      details: [
        {
          context: {
            key: "siret",
            label: "siret",
            regex: {},
            value: "INVALID",
          },
          message: '"siret" with value "INVALID" fails to match the required pattern: /^([0-9]{9}|[0-9]{14})$/',
          path: ["siret"],
          type: "string.pattern.base",
        },
      ],
      error: "Bad Request",
      message: "Erreur de validation",
      statusCode: 400,
    });
  });

  it("Vérifie qu'on renvoie une 404 pour un siret", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api/v1/datagouv/33333333333333");

    strictEqual(response.status, 404);
    deepStrictEqual(response.data, {
      error: "Not Found",
      message: "Siret inconnu",
      statusCode: 404,
    });
  });
});
