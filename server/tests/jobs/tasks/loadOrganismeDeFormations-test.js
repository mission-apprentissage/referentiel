const assert = require("assert");
const loadOrganismeDeFormations = require("../../../src/jobs/tasks/loadOrganismeDeFormations");
const { createStream } = require("../../utils/testUtils");

describe("loadOrganismeDeFormations", () => {
  it("Vérifie que peut charger en mémoire la liste des CFA", async () => {
    let input = createStream(`"siren";"num_etablissement";"cfa"
"111111111";"00006";"Oui"
"222222222";"00002";"Non"`);

    let organismes = await loadOrganismeDeFormations({ input });

    assert.strictEqual(organismes.length, 1);
    assert.deepStrictEqual(organismes[0], "11111111100006");
  });
});
