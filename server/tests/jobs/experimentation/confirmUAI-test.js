const assert = require("assert");
const { createStream } = require("../../utils/testUtils");
const confirmUAI = require("../../../src/jobs/experimentation/confirmUAI");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { insertEtablissement } = require("../../utils/fakeData");

let getCsvStream = (content) => {
  return createStream(
    content ||
      `siret;uai
11111111100006;0751234J
`
  );
};

describe("confirmUAI", () => {
  it("Vérifie qu'on peut confirmer un uai", async () => {
    await insertEtablissement({
      siret: "11111111100006",
      uais: [
        {
          sources: ["dummy"],
          uai: "0751234J",
          valide: true,
          confirmé: false,
        },
      ],
    });

    let stats = await confirmUAI(
      getCsvStream(`siret;uai
11111111100006;0751234J
`)
    );

    const found = await dbCollection("etablissements").findOne({ siret: "11111111100006" });
    assert.strictEqual(found.uai, "0751234J");
    assert.deepStrictEqual(found.uais, [
      {
        sources: ["dummy"],
        uai: "0751234J",
        valide: true,
        confirmé: true,
      },
    ]);
    assert.deepStrictEqual(stats, {
      total: 1,
      updated: 1,
      ignored: 0,
      failed: 0,
    });
  });

  it("Vérifie qu'on ignore un uai vide", async () => {
    await insertEtablissement({
      siret: "11111111100006",
      uais: [
        {
          sources: ["dummy"],
          uai: "0751234J",
          valide: true,
          confirmé: false,
        },
      ],
    });

    let stats = await confirmUAI(
      getCsvStream(`siret;uai
11111111100006;
`)
    );

    const found = await dbCollection("etablissements").findOne({ siret: "11111111100006" });
    assert.ok(!found.uai);
    assert.deepStrictEqual(found.uais, [
      {
        sources: ["dummy"],
        uai: "0751234J",
        valide: true,
        confirmé: false,
      },
    ]);
    assert.deepStrictEqual(stats, {
      total: 1,
      updated: 0,
      ignored: 1,
      failed: 0,
    });
  });
});
