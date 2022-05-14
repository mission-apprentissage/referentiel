const axios = require("axios");
const RateLimitedApi = require("./RateLimitedApi");
const { URLSearchParams } = require("url");
const acceHtmlParser = require("../../jobs/acce/acceHtmlParser");
const { pickBy, identity } = require("lodash");

const CHROME_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36";

function omitNull(obj) {
  return pickBy(obj, identity);
}

class AcceApi extends RateLimitedApi {
  constructor(options = {}) {
    super("AcceApi", options);
    const client = options.axios || axios.create({ timeout: 10000 });
    client.defaults.headers.common["User-Agent"] = CHROME_USER_AGENT;
    this.client = client;
  }

  async search(options = {}) {
    const { natures = [], uai = "" } = options;

    const response = await this.client.get("https://www.education.gouv.fr/acce_public/index.php");

    const cookie = response.headers["set-cookie"][0];
    const sessionId = cookie.match(/PHPSESSID=(.*);/)[1];
    const session = {
      Cookie: `PHPSESSID=${sessionId}`,
    };

    const params = new URLSearchParams();
    params.append("action", "search");
    params.append("sub_action", "facet");
    params.append("page", "1");
    params.append("sort", "");
    params.append("list_mode", "list");
    params.append("pt_NE_x", "");
    params.append("pt_NE_y", "");
    params.append("pt_SW_x", "");
    params.append("pt_SW_y", "");
    params.append("pt_NE_x_save", "");
    params.append("pt_NE_y_save", "");
    params.append("pt_SW_x_save", "");
    params.append("pt_SW_y_save", "");
    params.append("mode", "simple");
    params.append("localisation", "");
    params.append("facet_group_secteur_public_prive", "on");
    params.append("facet_group_pays", "on");
    params.append("facet_group_region", "on");
    params.append("facet_group_academie", "on");
    params.append("facet_group_departement_insee_3", "on");
    params.append("facet_group_commune_dept", "on");
    params.append("facet_group_etat_etablissement", "on");
    params.append("facet_group_ministere_tutelle", "on");
    params.append("facet_group_nature_uai", "on");
    params.append("facet_group_niveau_uai", "on");
    params.append("facet_group_categorie_juridique", "on");
    params.append("facet_group_type_zone_uai_restr", "on");
    params.append("facet_group_map", "0");
    params.append("text_filter_region", "");
    params.append("page_size", "100");
    natures.forEach((nature) => params.append("f_nature_uai[]", nature));
    params.append("simple_public", uai);

    const { data } = await this.client.post("https://www.education.gouv.fr/acce_public/search.php", params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...session,
      },
    });

    const { searchPage } = acceHtmlParser(data);

    return {
      nbResults: searchPage.getNbResults(),
      session,
      searchParams: params,
    };
  }
  getEtablissement(session, id) {
    return this.execute(async () => {
      const { data } = await this.client.get(
        `https://www.education.gouv.fr/acce_public/uai.php?uai_mode=list&uai_ndx=${id}`,
        {
          headers: {
            ...session,
          },
        }
      );

      const { etablissementPage } = acceHtmlParser(data);

      return omitNull({
        ...etablissementPage.getForm1Properties(),
        ...etablissementPage.getForm2Properties(),
        geojson: etablissementPage.getCoordinates(),
      });
    });
  }
}

module.exports = AcceApi;
