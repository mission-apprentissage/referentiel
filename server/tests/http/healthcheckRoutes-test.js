const assert = require("assert");
const { startServer, generateAuthHeader } = require("../utils/testUtils");
const { insertUsers } = require("../utils/fakeData");

describe("healthcheckRoutes", () => {
  it("Vérifie que le server fonctionne", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api/v1/healthcheck");

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data.healthcheck, true);
  });

  it("Vérifie qu'on peut générer une erreur", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api/v1/healthcheck/error");

    assert.strictEqual(response.status, 500);
    assert.deepStrictEqual(response.data, {
      error: "Internal Server Error",
      message: "An internal server error occurred",
      statusCode: 500,
    });
  });

  it("Vérifie qu'il faut un token pour accéder à une route protégée avec un header Authorization (région)", async () => {
    const { httpClient } = await startServer();

    await insertUsers();

    const response = await httpClient.get(`/api/v1/healthcheck/auth`, {
      headers: {
        ...generateAuthHeader("bonjour@test.fr", "region", "11"),
      },
    });

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, { code: "11", type: "region" });
  });

  it("Vérifie qu'il faut un token pour accéder à une route protégée avec un header Authorization (academie)", async () => {
    const { httpClient } = await startServer();

    await insertUsers({ type: "academie" });

    const response = await httpClient.get(`/api/v1/healthcheck/auth`, {
      headers: {
        ...generateAuthHeader("bonjour@test.fr", "academie", "11"),
      },
    });

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, { code: "11", type: "academie" });
  });

  it("Vérifie qu'on ne peut pas accéder à une route protégée", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api/v1/healthcheck/auth");

    assert.strictEqual(response.status, 401);
    assert.deepStrictEqual(response.data, {
      success: false,
      message: "Email ou mot de passe incorrect",
      statusCode: 401,
    });
  });
});
