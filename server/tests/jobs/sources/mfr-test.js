const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertOrganisme } = require("../../utils/fakeData");

describe("mfr", () => {
  it("Vérifie qu'on peut collecter des informations du fichier mfr avec le siret", async () => {
    await insertOrganisme({ siret: "11111111100006" });
    let source = createSource("mfr", {
      input: createStream(
        `uai;uai_code_educnationale;siret
"0111111Y";"0011073X";"11111111100006"`
      ),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["mfr"]);
    assert.deepStrictEqual(found.uai_potentiels, [
      {
        sources: ["mfr"],
        uai: "0011073X",
        valide: false,
      },
      {
        sources: ["mfr"],
        uai: "0111111Y",
        valide: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      mfr: {
        total: 1,
        updated: 1,
        ignored: 0,
        failed: 0,
      },
    });
  });

  it("Vérifie qu'on peut collecter des informations du fichier mfr avec un uai", async () => {
    await insertOrganisme({ siret: "11111111100006", uai: "0111111Y" });
    let source = createSource("mfr", {
      input: createStream(
        `uai;uai_code_educnationale;siret
"0111111Y";"0011073X";"11111111100006"`
      ),
    });

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["mfr"]);
    assert.deepStrictEqual(found.uai_potentiels[0], {
      sources: ["mfr"],
      uai: "0011073X",
      valide: false,
    });
  });

  it("Vérifie qu'on peut collecter des informations du fichier mfr avec un uai_code_educnationale", async () => {
    await insertOrganisme({ siret: "11111111100006", uai: "0011073X" });
    let source = createSource("mfr", {
      input: createStream(
        `uai;uai_code_educnationale;siret
"0111111Y";"0011073X";"11111111100006"`
      ),
    });

    await collectSources(source);

    let found = await dbCollection("organismes").findOne({ "uai_potentiels.uai": "0011073X" });
    assert.deepStrictEqual(found.reseaux, ["mfr"]);
    assert.deepStrictEqual(found.uai_potentiels[1], {
      sources: ["mfr"],
      uai: "0111111Y",
      valide: true,
    });
  });
});
