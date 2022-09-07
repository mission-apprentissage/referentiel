const { omit } = require("lodash");
const assert = require("assert");
const importAcce = require("../../../src/jobs/importAcce");
const { dbCollection } = require("../../../src/common/db/mongodb");
const { mockAcceApi } = require("../../utils/apiMocks.js");
const AcceApi = require("../../../src/common/apis/AcceApi.js");

function mockApi(fileContent) {
  const extractionId = "tmpsYfn7y";

  mockAcceApi((client) => {
    client
      .post((uri) => uri.includes("ident.php"))
      .query(() => true)
      .reply(200, "", { "set-cookie": "men_default=12345;" });
  });

  mockAcceApi((client, responses) => {
    client
      .post((uri) => uri.includes("getextract.php"))
      .query((q) => !q.ex_id)
      .reply(200, responses.getextract(extractionId));
  });

  mockAcceApi((client, responses) => {
    client
      .get((uri) => uri.includes("getextract.php"))
      .query({ ex_id: extractionId })
      .reply(200, responses.pollextract(fileContent), { "content-disposition": "attachement=fichier.csv" });
  });

  return new AcceApi({ pollMs: 2, nbRequests: 10 });
}

describe("importAcce", () => {
  it("Vérifie qu'on peut importer un établissement et son UAI", async () => {
    const api = mockApi();

    const stats = await importAcce({ api });

    const found = await dbCollection("acce").findOne({});
    assert.deepStrictEqual(omit(found, ["_id"]), {
      numero_uai: "0751234J",
      nature_uai: "320",
      nature_uai_libe: "Lycée professionnel",
      etat_etablissement: "1",
      etat_etablissement_libe: "Ouvert",
      mel_uai: "contact@organisme.fr",
    });
    assert.deepStrictEqual(stats, {
      total: 1,
      created: 1,
      updated: 0,
      failed: 0,
    });
  });

  it("Vérifie qu'on importe uniquement les établissements ouvert ou à ouvrir", async () => {
    const api = mockApi(`numero_uai;nature_uai;nature_uai_libe;etat_etablissement;etat_etablissement_libe
0751234A;320;Lycée professionnel;4;Fermé
0751234B;320;Lycée professionnel;3;À ouvrir
0751234C;320;Lycée professionnel;2;À fermer`);

    await importAcce({ api });

    assert.deepStrictEqual(await dbCollection("acce").countDocuments(), 1);
    const found = await dbCollection("acce").findOne({ numero_uai: "0751234B" });
    assert.strictEqual(found.etat_etablissement_libe, "À ouvrir");
  });

  it("Vérifie qu'on ignore certaines natures", async () => {
    const api = mockApi(`numero_uai;nature_uai;nature_uai_libe;etat_etablissement;etat_etablissement_libe
0751234A;000;Nature à exclure;1;Ouvert`);

    await importAcce({ api });

    assert.deepStrictEqual(await dbCollection("acce").countDocuments(), 0);
  });
});
