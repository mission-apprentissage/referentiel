const { strictEqual, deepStrictEqual } = require("assert");
const { insertOrganisme } = require("../utils/fakeData");
const { startServer, generateAuthHeader } = require("../utils/testUtils");

describe("tableauDeBordRoutes", () => {
  it("Vérifie qu'on peut obtenir les informations", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      statuts: ["gestionnaire", "formateur"],
      uai: "0751234J",
      uai_potentiels: [
        {
          sources: ["dummy"],
          uai: "0751234J",
          valide: false,
        },
      ],
    });
    await insertOrganisme({
      siret: "22222222200002",
      uai_potentiels: [
        {
          sources: ["dummy"],
          uai: "0751234J",
          valide: false,
        },
      ],
    });
    await insertOrganisme({
      siret: "33333333300008",
    });

    let response = await httpClient.get("/api/v1/validation", {
      headers: {
        ...generateAuthHeader("region", "11"),
      },
    });

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      validation: {
        A_VALIDER: 1,
        INCONNUE: 1,
        VALIDEE: 1,
      },
    });
  });
});
