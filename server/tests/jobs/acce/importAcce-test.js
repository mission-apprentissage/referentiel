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
    assert.deepStrictEqual(omit(found, ["_id"]), {
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
        searchParams:
          "action=search&sub_action=facet&page=1&sort=&list_mode=list&pt_NE_x=&pt_NE_y=&pt_SW_x=&pt_SW_y=&pt_NE_x_save=&pt_NE_y_save=&pt_SW_x_save=&pt_SW_y_save=&mode=simple&localisation=&facet_group_secteur_public_prive=on&facet_group_pays=on&facet_group_region=on&facet_group_academie=on&facet_group_departement_insee_3=on&facet_group_commune_dept=on&facet_group_etat_etablissement=on&facet_group_ministere_tutelle=on&facet_group_nature_uai=on&facet_group_niveau_uai=on&facet_group_categorie_juridique=on&facet_group_type_zone_uai_restr=on&facet_group_map=0&text_filter_region=&page_size=100&f_nature_uai%5B%5D=Annexe+d%27un+organisme+de+formation+-+Centre+de+formation+d%27apprentis&f_nature_uai%5B%5D=Antenne+d%27un+%C3%A9tablissement+d%27enseignement+sup%C3%A9rieur+priv%C3%A9&f_nature_uai%5B%5D=Antenne+de+centre+de+formation+d%27apprentis&f_nature_uai%5B%5D=Antenne+d%C3%A9localis%C3%A9e+d%27IUT&f_nature_uai%5B%5D=Antenne+d%C3%A9localis%C3%A9e+d%27une+composante+d%27universit%C3%A9&f_nature_uai%5B%5D=Antenne&f_nature_uai%5B%5D=Centre+acad%C3%A9mique+de+formation+continue&f_nature_uai%5B%5D=Centre+d%27enseignement+%C3%A0+distance&f_nature_uai%5B%5D=Centre+d%27%C3%A9ducation+aux+technologies+appropri%C3%A9es+au+d%C3%A9veloppement&f_nature_uai%5B%5D=Centre+de+formation+aux+carri%C3%A8res+des+biblioth%C3%A8ques&f_nature_uai%5B%5D=Centre+de+formation+d%27apprentis%2C+sous+convention+nationale&f_nature_uai%5B%5D=Centre+de+formation+d%27apprentis%2C+sous+convention+r%C3%A9gionale&f_nature_uai%5B%5D=Centre+de+formation+professionnelle+et+de+promotion+agricole&f_nature_uai%5B%5D=Centre+r%C3%A9gional+associ%C3%A9+au+CNAM&f_nature_uai%5B%5D=Circonscription+d%27inspection+de+l%27%C3%A9ducation+nationale&f_nature_uai%5B%5D=Direction+des+services+d%C3%A9partementaux+de+l%27%C3%A9ducation+nationale&f_nature_uai%5B%5D=Coll%C3%A8ge&f_nature_uai%5B%5D=Coll%C3%A8ge+sp%C3%A9cialis%C3%A9&f_nature_uai%5B%5D=Composante+d%27un+organisme+de+recherche&f_nature_uai%5B%5D=Composante+d%27universit%C3%A9+avec+formation+dipl%C3%B4mante&f_nature_uai%5B%5D=Ecole+d%27administration+publique&f_nature_uai%5B%5D=Ecole+d%27architecture&f_nature_uai%5B%5D=Ecole+d%27ing%C3%A9nieurs&f_nature_uai%5B%5D=Ecole+d%27ing%C3%A9nieurs+publique+%28hors+tutelle+MESR%29+ou+priv%C3%A9e&f_nature_uai%5B%5D=Ecole+de+commerce%2C+gestion%2C+comptabilit%C3%A9%2C+vente&f_nature_uai%5B%5D=Ecole+de+formation+agricole+ou+halieutique&f_nature_uai%5B%5D=Ecole+de+formation+artistique&f_nature_uai%5B%5D=Ecole+de+formation+d%27enseignants&f_nature_uai%5B%5D=Ecole+de+formation+sanitaire+et+sociale&f_nature_uai%5B%5D=Ecole+de+plein+air&f_nature_uai%5B%5D=Ecole+europ%C3%A9enne%2C+des+r%C3%A9seaux+groupements+des+GESBF+et+SEFFECSA&f_nature_uai%5B%5D=Ecole+francaise+%C3%A0+l%27%C3%A9tranger&f_nature_uai%5B%5D=Ecole+juridique&f_nature_uai%5B%5D=Ecole+normale+sup%C3%A9rieure&f_nature_uai%5B%5D=Ecole+secondaire+sp%C3%A9cialis%C3%A9e+%28second+cycle%29&f_nature_uai%5B%5D=Ecole+technico-professionnelle+de+production+industrielle&f_nature_uai%5B%5D=Ecole+technico-professionnelle+des+services&f_nature_uai%5B%5D=Etablissement+compos%C3%A9+uniquement+de+STS+et%2Fou+de+CPGE&f_nature_uai%5B%5D=Etablissement+d%27enseignement+g%C3%A9n%C3%A9ral+sup%C3%A9rieur+priv%C3%A9&f_nature_uai%5B%5D=Etablissement+de+formation+aux+m%C3%A9tiers+du+sport&f_nature_uai%5B%5D=Etablissement+de+formation+continue&f_nature_uai%5B%5D=Etablissement+de+lutte+contre+la+tuberculose&f_nature_uai%5B%5D=Etablissement+de+r%C3%A9insertion+scolaire&f_nature_uai%5B%5D=Etablissement+exp%C3%A9rimental&f_nature_uai%5B%5D=Etablissement+hospitalier&f_nature_uai%5B%5D=Etablissement+m%C3%A9dico-exp%C3%A9rimental&f_nature_uai%5B%5D=Etablissement+pour+d%C3%A9ficients+auditifs&f_nature_uai%5B%5D=Etablissement+pour+d%C3%A9ficients+visuels&f_nature_uai%5B%5D=Etablissement+pour+infirmes+moteurs&f_nature_uai%5B%5D=Etablissement+pour+poly-handicap%C3%A9s&f_nature_uai%5B%5D=Etablissement+pour+sourds-aveugles&f_nature_uai%5B%5D=Etablissement+public+d%27enseignement+sup%C3%A9rieur&f_nature_uai%5B%5D=Etablissement+r%C3%A9gional+d%27enseignement+adapt%C3%A9&f_nature_uai%5B%5D=GIP+pour+la+formation+continue+et+l%27insertion+professionnelle&f_nature_uai%5B%5D=GRETA&f_nature_uai%5B%5D=Institut+d%27admininistration+des+entreprises&f_nature_uai%5B%5D=Institut+d%27%C3%A9tudes+politiques&f_nature_uai%5B%5D=Institut+universitaire+de+technologie&f_nature_uai%5B%5D=Institut+universitaire+professionnalis%C3%A9&f_nature_uai%5B%5D=Institut+m%C3%A9dico-%C3%A9ducatif&f_nature_uai%5B%5D=Lyc%C3%A9e+d%27enseignement+g%C3%A9n%C3%A9ral&f_nature_uai%5B%5D=Lyc%C3%A9e+d%27enseignement+g%C3%A9n%C3%A9ral+et+technologique&f_nature_uai%5B%5D=Lyc%C3%A9e+d%27enseignement+g%C3%A9n%C3%A9ral%2C+technologique+et+professionnel+agricole&f_nature_uai%5B%5D=Lyc%C3%A9e+d%27enseignement+technologique&f_nature_uai%5B%5D=Lyc%C3%A9e+polyvalent&f_nature_uai%5B%5D=Lyc%C3%A9e+professionnel&f_nature_uai%5B%5D=Maison+d%C3%A9partementale+des+personnes+handicap%C3%A9es&f_nature_uai%5B%5D=Maison+familiale+rurale+d%27%C3%A9ducation+et+d%27orientation&f_nature_uai%5B%5D=Organisme+de+formation+-+Centre+de+formation+d%27apprentis&f_nature_uai%5B%5D=Section+d%27apprentissage&f_nature_uai%5B%5D=Section+d%27enseignement+g%C3%A9n%C3%A9ral+et+professionnel+adapt%C3%A9&f_nature_uai%5B%5D=Section+d%27enseignement+g%C3%A9n%C3%A9ral+ou+technologique&f_nature_uai%5B%5D=Section+d%27enseignement+professionnel&f_nature_uai%5B%5D=Service+d%27%C3%A9ducation+sp%C3%A9cialis%C3%A9e+et+de+soins+%C3%A0+domicile&f_nature_uai%5B%5D=Rectorat&f_nature_uai%5B%5D=Universit%C3%A9&f_nature_uai%5B%5D=Universit%C3%A9+de+technologie&simple_public=",
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
