const assert = require("assert");
const { mockCatalogueApi } = require("../../utils/apiMocks");
const isCollected = require("../../../src/common/actions/isCollected");

describe("catalogue", () => {
  it("Vérifie qu'on savoir si un établissement est collecté dans le catalogue", async () => {
    mockCatalogueApi((client, responses) => {
      client
        .get((uri) => uri.includes("etablissement"))
        .query(() => true)
        .reply(
          200,
          responses.etablissement({
            tags: ["2022"],
          })
        );
    });

    const collected = await isCollected({ siret: "11111111100006" }, "2022");

    assert.ok(collected);
  });

  it("Vérifie qu'on savoir si un établissement n'est pas collecté dans le catalogue", async () => {
    mockCatalogueApi((client, responses) => {
      client
        .get((uri) => uri.includes("etablissement"))
        .query(() => true)
        .reply(
          200,
          responses.etablissement({
            tags: ["2021"],
          })
        );
    });

    const collected = await isCollected({ siret: "11111111100006" }, "2022");

    assert.ok(!collected);
  });
});
