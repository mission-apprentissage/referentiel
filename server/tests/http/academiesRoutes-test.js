const { strictEqual, deepStrictEqual } = require("assert");
const { startServer } = require("../utils/testUtils");
const { last } = require("lodash");

describe("academiesRoutes", () => {
  it("Vérifie qu'on peut lister les académies", async () => {
    const { httpClient } = await startServer();

    let response = await httpClient.get("/api/v1/academies");

    strictEqual(response.status, 200);
    strictEqual(response.data.academies.length, 37);
    deepStrictEqual(last(response.data.academies), {
      code: "00",
      nom: "Étranger",
      departements: [{ code: "984", nom: "Terres australes et antarctiques françaises" }],
    });
  });
});
