const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertOrganisme } = require("../../utils/fakeData");

describe("enseignement-catholique", () => {
  it("Vérifie qu'on peut collecter les informations", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    await insertOrganisme({ siret: "22222222200002" });
    let source = createSource("enseignement-catholique", {
      input: [
        createStream(`"N° UAI CFA";"SIRET"
"0111111Y";"11111111100006"`),
        createStream(`"CFA";"SIRET CFA";"UFA";"UAI CFA UFA";"SIRET UFA"
"cfa";"11111111100006";"ufa";"0222222Y";"22222222200002"`),
      ],
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["enseignement-catholique"]);
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["enseignement-catholique"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(found.relations, [
      {
        type: "responsable->formateur",
        siret: "22222222200002",
        label: "cfa",
        referentiel: true,
        sources: ["enseignement-catholique"],
      },
    ]);

    found = await dbCollection("organismes").findOne({ siret: "22222222200002" }, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["enseignement-catholique"]);
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["enseignement-catholique"],
        uai: "0222222Y",
        valide: false,
      },
    ]);
    assert.deepStrictEqual(found.relations, [
      {
        type: "formateur->responsable",
        siret: "11111111100006",
        label: "ufa",
        referentiel: true,
        sources: ["enseignement-catholique"],
      },
    ]);

    assert.deepStrictEqual(stats, {
      "enseignement-catholique": {
        total: 3,
        updated: 3,
        unknown: 0,
        anomalies: 0,
        failed: 0,
      },
    });
  });
});
