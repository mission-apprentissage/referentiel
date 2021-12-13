const { strictEqual, deepStrictEqual } = require("assert");
const { startServer } = require("../utils/testUtils");
const { last } = require("lodash");

describe("academiesRoutes", () => {
  it("Vérifie qu'on peut lister les académies", async () => {
    const { httpClient } = await startServer();

    let response = await httpClient.get("/api/v1/data");

    strictEqual(response.status, 200);
    strictEqual(response.data.academies.length, 37);
    deepStrictEqual(last(response.data.regions), {
      code: "11",
      nom: "Île-de-France",
      departements: [
        { code: "75", nom: "Paris" },
        { code: "77", nom: "Seine-et-Marne" },
        { code: "78", nom: "Yvelines" },
        { code: "91", nom: "Essonne" },
        { code: "92", nom: "Hauts-de-Seine" },
        { code: "93", nom: "Seine-Saint-Denis" },
        { code: "94", nom: "Val-de-Marne" },
        { code: "95", nom: "Val-d'Oise" },
      ],
      academies: [
        { code: "01", nom: "Paris" },
        { code: "24", nom: "Créteil" },
        { code: "25", nom: "Versailles" },
      ],
    });
    deepStrictEqual(last(response.data.academies), {
      code: "00",
      nom: "Étranger",
      departements: [{ code: "984", nom: "Terres australes et antarctiques françaises" }],
    });
    deepStrictEqual(last(response.data.departements), { code: "989", nom: "Île de Clipperton" });
  });
});
