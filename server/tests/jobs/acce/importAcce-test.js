const { omit } = require("lodash");
const assert = require("assert");
const { getMockedAcceApi } = require("../../utils/apiMocks");
const importAcce = require("../../../src/jobs/acce/importAcce");
const { dbCollection } = require("../../../src/common/db/mongodb");

describe("importAcce", () => {
  it("Vérifie qu'on peut scrapper et importer un etablissement", async () => {
    const api = getMockedAcceApi((mock, responses) => {
      mock.onGet(/.*index.php.*/).reply(200, responses.index(), {
        "set-cookie": ["PHPSESSID=123;"],
      });
      mock.onPost(/.*search.php.*/).reply(200, responses.search());
      mock.onGet(/.*uai.php.*/).reply(200, responses.etablissement());
    });

    const stats = await importAcce({ acceApi: api });

    const found = await dbCollection("acce").findOne({});
    assert.ok(found._search.searchParams.startsWith("action=search&sub_action=facet&page=1&sort=&list_mode=list"));
    assert.deepStrictEqual(omit(found, ["_id", "_search.searchParams"]), {
      nom: "Centre de Formation d'Apprentis transport et logistique",
      uai: "0511972S",
      adresse: "16 RUE DU VAL CLAIR - Reims",
      academie: "Reims",
      tel: "0123456789",
      fax: "0123456780",
      email: "email@organisme.com",
      site_web: "http://www.organisme.com/",
      maj: new Date("2020-12-01T00:00:00.000Z"),
      etat: "Ouvert",
      dateOuverture: new Date("1993-05-10T00:00:00.000Z"),
      tutelle: "ministère de l'éducation nationale",
      secteur: "Privé",
      denominations: {
        sigle: "ANT CFA",
        denomination_principale: "ANTENNE DE CFA",
        patronyme: "TRANSPORT LOGISTIQUE",
      },
      localisation: {
        adresse: "16  RUE DU VAL CLAIR",
        acheminement: "BP53 - 51683 REIMS CEDEX 2",
      },
      administration: {
        nature: "Antenne de centre de formation d'apprentis",
        niveau: "UAI fille",
        categorie_juridique: "Sans personnalité juridique",
      },
      zones: {
        agglomeration_urbaine: "REIMS",
        bassin_de_formation: "REIMS",
        canton: "REIMS NON PRECISE",
        commune: "REIMS",
      },
      specificites: [],
      rattachements: {
        fille: [],
        mere: [
          {
            uai: "0541958K",
            sigle: "CFA",
            patronyme: "TRANSPORT ET LOGISTIQUE",
            nature: "Centre de formation d'apprentis, sous convention régionale",
            commune: "Jarville-la-Malgrange",
          },
        ],
      },
      geojson: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-1.9006796357562448, 48.14476299290637],
        },
      },
      _search: {
        searchIndex: 1,
      },
    });
    assert.deepStrictEqual(stats, {
      total: 1,
      created: 1,
      updated: 0,
      failed: 0,
    });
  });

  it("Vérifie qu'on peut importer un établissement sans coordonnées de géolocalisation", async () => {
    const api = getMockedAcceApi((mock, responses) => {
      mock.onGet(/.*index.php.*/).reply(200, responses.index(), {
        "set-cookie": ["PHPSESSID=123;"],
      });
      mock.onPost(/.*search.php.*/).reply(200, responses.search());
      mock.onGet(/.*uai.php.*/).reply(200, responses.noGeoloc());
    });

    await importAcce({ acceApi: api });

    const found = await dbCollection("acce").findOne({});
    assert.ok(found.geoloc === undefined);
  });

  it("Vérifie qu'on gère les erreurs durant le scrapping", async () => {
    const api = getMockedAcceApi((mock, responses) => {
      mock.onGet(/.*index.php.*/).reply(200, responses.index(), {
        "set-cookie": ["PHPSESSID=123;"],
      });
      mock.onPost(/.*search.php.*/).reply(200, responses.search());
      mock.onGet(/.*uai.php.*/).reply(500, "<html></html>");
    });

    const stats = await importAcce({ acceApi: api });

    const count = await dbCollection("acce").countDocuments();
    assert.strictEqual(count, 0);
    assert.deepStrictEqual(stats, {
      total: 1,
      created: 0,
      updated: 0,
      failed: 1,
    });
  });
});
