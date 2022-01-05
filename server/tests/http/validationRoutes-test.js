const { strictEqual, deepStrictEqual } = require("assert");
const { insertOrganisme } = require("../utils/fakeData");
const { startServer, generateAuthHeader } = require("../utils/testUtils");

describe("validationRoutes", () => {
  it("Vérifie qu'on peut obtenir les informations", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme({
      siret: "11111111100001",
      statuts: ["gestionnaire", "formateur"],
      uai: "0751234J",
      etat_administratif: "actif",
      numero_declaration_activite: "01234567899",
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
      etat_administratif: "actif",
      numero_declaration_activite: "01234567899",
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
      etat_administratif: "actif",
      numero_declaration_activite: "01234567899",
    });

    await insertOrganisme({
      siret: "44444444400008",
      etat_administratif: "fermé",
    });

    await insertOrganisme({
      siret: "55555555500008",
      etat_administratif: "actif",
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
        A_RENSEIGNER: 1,
        VALIDE: 1,
      },
    });
  });
});
