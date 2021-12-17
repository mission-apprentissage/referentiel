const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertOrganisme } = require("../../utils/fakeData");

describe("datadock", () => {
  it("Vérifie qu'on peut collecter des informations datadock", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    await insertOrganisme({ siret: "22222222200002" });
    let source = createSource("datadock", {
      input: createStream(
        `siret;REFERENCABLE
"11111111100006";"OUI"
"22222222200002";"NON"`
      ),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.strictEqual(found.conformite_reglementaire.certificateur, "datadock");
    found = await dbCollection("organismes").findOne({ siret: "22222222200002" }, { _id: 0 });
    assert.strictEqual(found.conformite_reglementaire.certificateur, undefined);

    assert.deepStrictEqual(stats, {
      datadock: {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut préserver le conventionnement", async () => {
    await insertOrganisme({
      siret: "11111111100006",
      conformite_reglementaire: {
        conventionne: true,
      },
    });
    let source = createSource("datadock", {
      input: createStream(
        `siret;REFERENCABLE
"11111111100006";"OUI"`
      ),
    });

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.strictEqual(found.conformite_reglementaire.conventionne, true);
  });
});
