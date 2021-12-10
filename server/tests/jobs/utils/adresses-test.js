const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { mockGeoAddresseApi } = require("../../utils/apiMocks");
const adresses = require("../../../src/common/adresses");
const GeoAdresseApi = require("../../../src/common/apis/GeoAdresseApi");

describe("adresses", () => {
  it("Vérifie qu'on met en cache les erreurs 4xx de l'API sirene", async () => {
    let { getAdresseFromCoordinates } = adresses(new GeoAdresseApi());
    mockGeoAddresseApi((client) => {
      client
        .get((uri) => uri.includes("reverse"))
        .query(() => true)
        .reply(400, {});

      client
        .get((uri) => uri.includes("search"))
        .query(() => true)
        .reply(400, {});
    });

    try {
      await getAdresseFromCoordinates(2, 48);
      assert.fail();
    } catch (e) {
      let found = await dbCollection("cache").findOne({ _id: "adresses_2_48" });
      assert.strictEqual(found.type, "error");
      assert.deepStrictEqual(found.value.message, "Coordonnées inconnues [2,48]");
    }
  });

  it("Vérifie qu'on ne met pas en cache les erreurs 5xx de l'API sirene", async () => {
    let { getAdresseFromCoordinates } = adresses(new GeoAdresseApi());
    mockGeoAddresseApi((client) => {
      client
        .get((uri) => uri.includes("reverse"))
        .query(() => true)
        .reply(500, {});

      client
        .get((uri) => uri.includes("search"))
        .query(() => true)
        .reply(500, {});
    });

    try {
      await getAdresseFromCoordinates(2, 48);
      assert.fail();
    } catch (e) {
      let found = await dbCollection("cache").findOne({ _id: "adresses_2_48" });
      assert.deepStrictEqual(found, null);
    }
  });
});
