const { strictEqual, deepStrictEqual } = require("assert");
const { insertAcce } = require("../utils/fakeData");
const { startServer } = require("../utils/testUtils");

describe("uaisRoutes", () => {
  it("Vérifie qu'on peut lister des UAI", async () => {
    const { httpClient } = await startServer();
    await insertAcce({
      uai: "0751234J",
    });

    let response = await httpClient.get("/api/v1/uais");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      uais: [
        {
          uai: "0751234J",
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

  it("Vérifie qu'on peut obtenir un UAI", async () => {
    const { httpClient } = await startServer();
    await insertAcce({
      uai: "0751234J",
    });

    let response = await httpClient.get("/api/v1/uais/0751234J");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, {
      uai: "0751234J",
    });
  });

  it("Vérifie qu'on renvoie une 400 sur l'UAI a un format invalide", async () => {
    const { httpClient } = await startServer();

    let response = await httpClient.get("/api/v1/uais/INVALID");

    strictEqual(response.status, 400);
    deepStrictEqual(response.data, {
      details: [
        {
          context: {
            key: "uai",
            label: "uai",
            regex: {},
            value: "INVALID",
          },
          message: '"uai" with value "INVALID" fails to match the required pattern: /^[0-9]{7}[A-Z]{1}$/',
          path: ["uai"],
          type: "string.pattern.base",
        },
      ],
      error: "Bad Request",
      message: "Erreur de validation",
      statusCode: 400,
    });
  });

  it("Vérifie qu'on renvoie une 404 sur l'UAI est inconnu", async () => {
    const { httpClient } = await startServer();

    let response = await httpClient.get("/api/v1/uais/0751234J");

    strictEqual(response.status, 404);
    deepStrictEqual(response.data, {
      error: "Not Found",
      message: "UAI inconnu",
      statusCode: 404,
    });
  });
});
