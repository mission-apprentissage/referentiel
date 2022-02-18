const { strictEqual, deepStrictEqual } = require("assert");
const { insertOrganisme } = require("../utils/fakeData");
const { startServer } = require("../utils/testUtils");

describe("uaisRoutes", () => {
  it("Vérifie qu'on peut obtenir des stats", async () => {
    const { httpClient } = await startServer();
    await insertOrganisme();
    await insertOrganisme({ uai: "0751234J" });

    let response = await httpClient.get("/api/v1/stats");

    strictEqual(response.status, 200);
    deepStrictEqual(response.data, { total: 2, valides: 1 });
  });
});
