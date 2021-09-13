const axios = require("axios");
const ApiError = require("./ApiError");
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
    let client = options.axios || axios.create({ timeout: 10000 });
    client.defaults.headers.common["User-Agent"] = CHROME_USER_AGENT;

    super("AcceApi", client, options);
    this.client = client;
  }

  async search(options = {}) {
    let { natures = [], uai = "" } = options;

    let response = await this.client.get("https://www.education.gouv.fr/acce_public/index.php");

    let cookie = response.headers["set-cookie"][0];
    let sessionId = cookie.match(/PHPSESSID=(.*);/)[1];
    let session = {
      Cookie: `PHPSESSID=${sessionId}`,
    };

    let params = new URLSearchParams();
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

    let { data } = await this.client.post("https://www.education.gouv.fr/acce_public/search.php", params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...session,
      },
    });

    let { searchPage } = acceHtmlParser(data);

    return {
      nbResults: searchPage.getNbResults(),
      session,
      searchParams: params,
    };
  }
  getEtablissement(session, id) {
    return this.execute(async (client) => {
      try {
        let { data } = await client.get(
          `https://www.education.gouv.fr/acce_public/uai.php?uai_mode=list&uai_ndx=${id}`,
          {
            headers: {
              ...session,
            },
          }
        );

        let { etablissementPage } = acceHtmlParser(data);

        return omitNull({
          ...etablissementPage.getForm1Properties(),
          ...etablissementPage.getForm2Properties(),
          geojson: etablissementPage.getCoordinates(),
        });
      } catch (e) {
        throw new ApiError("Api ACCE", e.message, e);
      }
    });
  }
}

module.exports = AcceApi;
