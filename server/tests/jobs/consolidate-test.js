const assert = require("assert");
const { dbCollection } = require("../../src/common/db/mongodb");
const { insertEtablissement } = require("../utils/fakeData");
const consolidate = require("../../src/jobs/consolidate");
const { omit } = require("lodash");

describe(__filename, () => {
  it("Vérifie qu'on peut valider un UAI", async () => {
    await insertEtablissement({
      siret: "11111111100006",
      uais: [
        {
          sources: ["deca", "sifa-ramsese"],
          uai: "0111111Y",
          valide: true,
        },
      ],
    });

    let stats = await consolidate();

    let found = await dbCollection("etablissements").findOne();
    assert.deepStrictEqual(found.uai, "0111111Y");
    assert.deepStrictEqual(stats, {
      validateUAI: {
        validated: 1,
        conflicted: 0,
      },
    });
  });

  it("Vérifie qu'on peut valider un UAI (+catalogue)", async () => {
    await insertEtablissement({
      siret: "11111111100006",
      uais: [
        {
          sources: ["deca", "sifa-ramsese", "tables-de-correspondances"],
          uai: "0111111Y",
          valide: true,
        },
      ],
    });

    await consolidate();

    let found = await dbCollection("etablissements").findOne();
    assert.deepStrictEqual(found.uai, "0111111Y");
  });

  it("Vérifie qu'on ne valide pas un UAI quand l'UAI du catalogue est différent", async () => {
    await insertEtablissement({
      siret: "11111111100006",
      uais: [
        {
          sources: ["deca", "sifa-ramsese"],
          uai: "0111111Y",
          valide: true,
        },
        {
          sources: ["tables-de-correspondances"],
          uai: "0222222W",
          valide: true,
        },
      ],
    });

    await consolidate();

    let found = await dbCollection("etablissements").findOne();
    assert.deepStrictEqual(found.uai, undefined);
  });

  it("Vérifie qu'on valide l'UAI le plus populaire", async () => {
    await insertEtablissement({
      siret: "11111111100006",
      uais: [
        {
          sources: ["deca", "sifa-ramsese", "other"],
          uai: "0111111Y",
          valide: true,
        },
        {
          sources: ["deca", "sifa-ramsese", "tables-de-correspondances"],
          uai: "0222222W",
          valide: true,
        },
      ],
    });

    await consolidate();

    let found = await dbCollection("etablissements").findOne();
    assert.deepStrictEqual(found.uai, "0222222W");
  });

  it("Vérifie qu'on détecte un UAI en conflict", async () => {
    await Promise.all([
      insertEtablissement(
        {
          siret: "11111111100006",
          uais: [
            {
              sources: ["deca", "sifa-ramsese"],
              uai: "0111111Y",
              valide: true,
            },
          ],
        },
        insertEtablissement({
          siret: "22222222200022",
          uais: [
            {
              sources: ["deca", "sifa-ramsese"],
              uai: "0111111Y",
              valide: true,
            },
          ],
        })
      ),
    ]);

    let stats = await consolidate();

    let found = await dbCollection("etablissements").findOne({ siret: "22222222200022" });
    assert.ok(!found.uai);
    assert.deepStrictEqual(
      found._meta.anomalies.map((a) => omit(a, ["date"])),
      [
        {
          code: "conflit_uai",
          details: "UAI 0111111Y en conflict avec 1 autres établissements",
          job: "consolidate",
          source: "annuaire",
        },
      ]
    );
    assert.deepStrictEqual(stats, {
      validateUAI: {
        validated: 0,
        conflicted: 2,
      },
    });
  });

  it("Vérifie qu'on peut ignorer les établissements qui ne peuvent pas être validé", async () => {
    await insertEtablissement({
      siret: "11111111100006",
      uais: [
        {
          sources: ["deca"],
          uai: "0111111Y",
          valide: true,
        },
      ],
    });

    let stats = await consolidate();

    let found = await dbCollection("etablissements").findOne();
    assert.ok(!found.uai);
    assert.deepStrictEqual(stats, {
      validateUAI: {
        validated: 0,
        conflicted: 0,
      },
    });
  });
});
