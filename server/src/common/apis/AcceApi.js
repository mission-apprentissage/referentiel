const queryString = require("query-string");
const RateLimitedApi = require("./RateLimitedApi");
const { fetchData, fetchStream } = require("../utils/httpUtils.js");
const { delay } = require("../utils/asyncUtils.js");
const config = require("../../config.js");
const logger = require("../logger").child({ context: "AcceApi" });

const CHROME_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36";

const SESSION_COOKIE_NAME = "men_default";

function getFormHeaders(auth) {
  return {
    "User-Agent": CHROME_USER_AGENT,
    "Content-Type": "application/x-www-form-urlencoded",
    ...(auth || {}),
  };
}

class AcceApi extends RateLimitedApi {
  constructor(options = {}) {
    const { pollMs = 5000, ...rest } = options;
    super("AcceApi", { nbRequests: 1, perSeconds: 1, ...rest });
    this.pollMs = pollMs;
  }

  static get baseApiUrl() {
    return "https://acce.depp.education.fr/acce";
  }

  async _login() {
    return this.execute(async () => {
      logger.debug(`Logging to ACCE...`);
      const response = await fetchData(`${AcceApi.baseApiUrl}/ajax/ident.php`, {
        raw: true,
        method: "POST",
        headers: getFormHeaders(),
        data: queryString.stringify({
          id: config.api.acce.username,
          mdp: config.api.acce.password,
          nom: null,
          prenom: null,
          email: null,
          fonction: null,
          organisme: null,
          commentaire: null,
        }),
      });

      const cookie = response.headers["set-cookie"][0];
      const sessionId = cookie.match(new RegExp(`${SESSION_COOKIE_NAME}=(.*);`))[1];
      return {
        Cookie: `${SESSION_COOKIE_NAME}=${sessionId}`,
      };
    });
  }

  async _startExtraction(auth) {
    return this.execute(async () => {
      logger.debug(`Requesting a new extraction...`);

      const params = new URLSearchParams();
      params.append("opt_sort_uai", "numero_uai");
      params.append("opt_type", "csv");
      params.append("chk_uai[]", "nature_uai");
      params.append("chk_uai[]", "nature_uai_libe");
      params.append("chk_uai[]", "etat_etablissement");
      params.append("chk_uai[]", "etat_etablissement_libe");
      params.append("chk_uai[]", "mel_uai");

      const data = await fetchData(`${AcceApi.baseApiUrl}/getextract.php`, {
        method: "POST",
        headers: getFormHeaders(auth),
        data: params.toString(),
      });

      const [, extractionId] = data.match(/getextract\.php\?ex_id=(.*)"/);

      return { extractionId };
    });
  }

  async _pollExtraction(auth, extractionId) {
    return this.execute(async () => {
      logger.debug(`Polling extraction ${extractionId}...`);

      const response = await fetchStream(`${AcceApi.baseApiUrl}/getextract.php?ex_id=${extractionId}`, {
        raw: true,
        encoding: "iso-8859-1",
        method: "GET",
        headers: {
          "User-Agent": CHROME_USER_AGENT,
          ...auth,
        },
      });

      const isReady = response.headers["content-disposition"]?.startsWith("attachement");
      if (!isReady) {
        response.stream.destroy();
        return null;
      }
      return response.stream;
    });
  }

  async streamCsvExtraction() {
    const auth = await this._login();

    let stream;
    const { extractionId } = await this._startExtraction(auth);
    while (!(stream = await this._pollExtraction(auth, extractionId))) {
      await delay(this.pollMs);
    }

    return stream;
  }
}

module.exports = AcceApi;
