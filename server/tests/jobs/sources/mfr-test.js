const assert = require("assert");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { createSource } = require("../../../src/jobs/sources/sources");
const collectSources = require("../../../src/jobs/collectSources");
const { createStream } = require("../../utils/testUtils");
const { insertEtablissement } = require("../../utils/fakeData");

describe("mfr", () => {
  it("Vérifie qu'on peut collecter des informations du fichier mfr avec le siret", async () => {
    await insertEtablissement({ siret: "11111111100006" });
    let source = createSource("mfr", {
      input: createStream(
        `uai;uai_code_educnationale;siret
"0111111Y";"0011073X";"11111111100006"`
      ),
    });

    let stats = await collectSources(source);

    let found = await dbCollection("etablissements").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["mfr"]);
    assert.deepStrictEqual(found.uais, [
      {
        sources: ["mfr"],
        uai: "0111111Y",
        valide: true,
      },
      {
        sources: ["mfr"],
        uai: "0011073X",
        valide: false,
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
    await insertEtablissement({
      uai: "0111111Y",
      siret: "11111111100006",
    });
    let source = createSource("mfr", {
      input: createStream(
        `uai;uai_code_educnationale;siret
"0111111Y";"0011073X";"11111111100006"`
      ),
    });

    await collectSources(source);

    let found = await dbCollection("etablissements").findOne({ siret: "11111111100006" }, { _id: 0 });
    assert.deepStrictEqual(found.reseaux, ["mfr"]);
    assert.deepStrictEqual(found.uais[1], {
      sources: ["mfr"],
      uai: "0011073X",
      valide: false,
    });
  });

  it("Vérifie qu'on peut collecter des informations du fichier mfr avec un uai_code_educnationale", async () => {
    await insertEtablissement({
      uai: "0011073X",
      siret: "11111111100006",
    });
    let source = createSource("mfr", {
      input: createStream(
        `uai;uai_code_educnationale;siret
"0111111Y";"0011073X";"11111111100006"`
      ),
    });

    await collectSources(source);

    let found = await dbCollection("etablissements").findOne({ "uais.uai": "0011073X" });
    assert.deepStrictEqual(found.reseaux, ["mfr"]);
    assert.deepStrictEqual(found.uais[0], {
      sources: ["mfr"],
      uai: "0111111Y",
      valide: true,
    });
  });
});
