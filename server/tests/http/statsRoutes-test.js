const { strictEqual, deepStrictEqual } = require("assert");
const { insertOrganisme } = require("../utils/fakeData");
const { startServer } = require("../utils/testUtils");

describe("statsRoutes", () => {
  it("Vérifie qu'on peut obtenir des stats de couverture", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({ uai: "0751234J" });

    let response = await httpClient.get("/api/v1/stats/couverture");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, { total: 2, valides: 1 });
  });

  it("Vérifie qu'on peut obtenir les stats des nouveaux organismes", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      qualiopi: true,
      nature: "responsable",
      adresse: {
        academie: { code: "01", nom: "Paris" },
      },
      _meta: { date_import: new Date() },
    });

    let response = await httpClient.get("/api/v1/stats/nouveaux");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, [
      {
        annee: 2022,
        mois: 3,
        total: 1,
      },
    ]);
  });

  it("Vérifie qu'on peut obtenir les stats sur les états administratifs", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({ etat_administratif: "actif" });
    await insertOrganisme({ etat_administratif: "fermé" });

    let response = await httpClient.get("/api/v1/stats/etat_administratif");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      actif: 1,
      fermé: 1,
    });
  });

  it("Vérifie qu'on peut obtenir les stats sur les natures", async () => {
    const { httpClient } = await startServer();
    await Promise.all([
      insertOrganisme({
        nature: "responsable",
        adresse: {
          academie: { code: "02", nom: "Aix-Marseille" },
        },
      }),
      insertOrganisme({
        nature: "responsable",
        adresse: {
          academie: { code: "01", nom: "Paris" },
        },
      }),
      insertOrganisme({
        nature: "responsable_formateur",
        adresse: {
          academie: { code: "01", nom: "Paris" },
        },
      }),
      insertOrganisme({
        nature: "formateur",
        adresse: {
          academie: { code: "01", nom: "Paris" },
        },
      }),
    ]);

    let response = await httpClient.get("/api/v1/stats/natures");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      academies: [
        {
          academie: {
            code: "02",
            nom: "Aix-Marseille",
          },
          formateur: 0,
          inconnu: 0,
          responsable: 1,
          responsable_formateur: 0,
        },
        {
          academie: {
            code: "01",
            nom: "Paris",
          },
          formateur: 1,
          inconnu: 0,
          responsable: 1,
          responsable_formateur: 1,
        },
      ],
      national: {
        formateur: 1,
        inconnu: 0,
        responsable: 2,
        responsable_formateur: 1,
      },
    });
  });

  it("Vérifie qu'on peut obtenir les stats sur la validation", async () => {
    const { httpClient } = await startServer();
    await Promise.all([
      insertOrganisme({
        etat_administratif: "actif",
        qualiopi: true,
        nature: "responsable",
        uai: "0751234J",
        adresse: {
          academie: { code: "01", nom: "Paris" },
        },
      }),
      insertOrganisme({
        etat_administratif: "actif",
        qualiopi: true,
        nature: "responsable",
        uai_potentiels: [
          {
            sources: ["dummy"],
            uai: "0751234J",
          },
        ],
        adresse: {
          academie: { code: "01", nom: "Paris" },
        },
      }),
      insertOrganisme({
        etat_administratif: "actif",
        qualiopi: true,
        nature: "responsable",
        adresse: {
          academie: { code: "01", nom: "Paris" },
        },
      }),
      insertOrganisme({
        etat_administratif: "actif",
        qualiopi: true,
        nature: "responsable_formateur",
        adresse: {
          academie: { code: "02", nom: "Aix-Marseille" },
        },
      }),
    ]);

    let response = await httpClient.get("/api/v1/stats/validation");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      academies: [
        {
          A_RENSEIGNER: 1,
          A_VALIDER: 0,
          VALIDE: 0,
          academie: {
            code: "02",
            nom: "Aix-Marseille",
          },
        },
        {
          A_RENSEIGNER: 1,
          A_VALIDER: 1,
          VALIDE: 1,
          academie: {
            code: "01",
            nom: "Paris",
          },
        },
      ],
      national: {
        A_RENSEIGNER: 2,
        A_VALIDER: 1,
        VALIDE: 1,
      },
    });
  });

  it("Vérifie qu'on peut obtenir les stats qualiopi", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({ nature: "responsable", qualiopi: true });
    await insertOrganisme({ nature: "responsable", qualiopi: true });
    await insertOrganisme({ nature: "formateur", qualiopi: true });
    await insertOrganisme({ qualiopi: false });

    let response = await httpClient.get("/api/v1/stats/qualiopi");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, [
      {
        nature: "formateur",
        non_qualiopi: 0,
        qualiopi: 1,
      },
      {
        nature: "inconnu",
        non_qualiopi: 1,
        qualiopi: 0,
      },
      {
        nature: "responsable",
        non_qualiopi: 0,
        qualiopi: 2,
      },
    ]);
  });
});
