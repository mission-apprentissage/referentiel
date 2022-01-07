const { strictEqual, deepStrictEqual } = require("assert");
const { insertOrganisme } = require("../utils/fakeData");
const { startServer, generateAuthHeader } = require("../utils/testUtils");

describe("validationRoutes", () => {
  it("Vérifie qu'on peut obtenir les informations", async () => {
    const { httpClient } = await startServer();
    await Promise.all([
      insertOrganisme({
        siret: "11111111100001",
        statuts: ["gestionnaire", "formateur"],
        uai: "0751234J",
        etat_administratif: "actif",
        qualiopi: true,
        uai_potentiels: [
          {
            sources: ["dummy"],
            uai: "0751234J",
            valide: false,
          },
        ],
      }),
      insertOrganisme({
        siret: "22222222200002",
        etat_administratif: "actif",
        statuts: ["gestionnaire", "formateur"],
        qualiopi: true,
        uai_potentiels: [
          {
            sources: ["dummy"],
            uai: "0751234J",
            valide: false,
          },
        ],
      }),
      insertOrganisme({
        siret: "33333333300000",
        etat_administratif: "actif",
        statuts: ["gestionnaire", "formateur"],
        qualiopi: true,
      }),
      insertOrganisme({
        siret: "44444444400000",
        qualiopi: false,
      }),
      insertOrganisme({
        siret: "55555555500000",
      }),
      insertOrganisme({
        siret: "66666666600000",
        statuts: ["gestionnaire"],
      }),
      insertOrganisme({
        siret: "77777777700000",
        statuts: ["formateur"],
      }),
    ]);

    let response = await httpClient.get("/api/v1/validation", {
      headers: {
        ...generateAuthHeader("region", "11"),
      },
    });

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      validation: {
        A_VALIDER: 1,
        A_RENSEIGNER: 1,
        VALIDE: 1,
      },
    });
  });
});
