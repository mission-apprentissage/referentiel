const { oleoduc, transformData } = require("oleoduc");
const mergeStream = require("merge-stream");
const { getOvhFileAsStream } = require("../../../common/utils/ovhUtils");
const { parseCsv } = require("../../../common/utils/csvUtils");

function readCsv(stream) {
  return oleoduc(stream, parseCsv(), { promisify: false });
}

async function defaultStream() {
  return mergeStream(
    readCsv(await getOvhFileAsStream("annuaire/Liste_Etablissements_2021-06-17_RAMSESE_AOuvrir.csv")),
    readCsv(await getOvhFileAsStream("annuaire/Liste_Etablissements_2021-06-18_RAMSESE_Complement.csv")),
    readCsv(await getOvhFileAsStream("annuaire/Liste_Etablissements_2021-07-15_RAMSESE_Complement2.csv")),
    readCsv(await getOvhFileAsStream("annuaire/Liste_Etablissements_2021-06-04_SIFA_RAMSESE.csv"))
  );
}

async function sifaRamsese(custom = {}) {
  let name = "sifa-ramsese";

  return {
    name,
    async stream() {
      let input = custom.input ? readCsv(custom.input) : await defaultStream();

      return oleoduc(
        input,
        transformData((data) => {
          return {
            siret: data.numero_siren_siret_uai,
            uai: data.numero_uai,
          };
        }),
        { promisify: false }
      );
    },
  };
}

module.exports = sifaRamsese;
