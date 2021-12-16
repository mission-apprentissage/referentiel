const { strictEqual, deepStrictEqual } = require("assert");
const { insertEtablissement } = require("../utils/fakeData");
const { startServer, generateAuthHeader } = require("../utils/testUtils");

describe("tableauDeBordRoutes", () => {
  it("Vérifie qu'on peut obtenir les informations", async () => {
    const { httpClient } = await startServer();
    await insertEtablissement({
      siret: "11111111100001",
      statuts: ["gestionnaire", "formateur"],
      uai: "0751234J",
      uais: [
        {
          sources: ["dummy"],
          uai: "0751234J",
          valide: false,
        },
      ],
    });
    await insertEtablissement({
      siret: "22222222200002",
      uais: [
        {
          sources: ["dummy"],
          uai: "0751234J",
          valide: false,
        },
      ],
    });
    await insertEtablissement({
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
