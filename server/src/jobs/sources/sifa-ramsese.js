const { compose, transformData, mergeStreams } = require("oleoduc");
const { getFromStorage } = require("../../common/utils/ovhUtils");
const { parseCsv } = require("../../common/utils/csvUtils");

function readCsv(stream) {
  return compose(stream, parseCsv());
}

async function defaultStream() {
  return mergeStreams(
    readCsv(await getFromStorage("Liste_Etablissements_2021-06-17_RAMSESE_AOuvrir.csv")),
    readCsv(await getFromStorage("Liste_Etablissements_2021-06-18_RAMSESE_Complement.csv")),
    readCsv(await getFromStorage("Liste_Etablissements_2021-07-15_RAMSESE_Complement2.csv")),
    readCsv(await getFromStorage("Liste_Etablissements_2021-06-04_SIFA_RAMSESE.csv"))
  );
}

module.exports = (custom = {}) => {
  const name = "sifa-ramsese";

  return {
    name,
    async referentiel() {
      const input = custom.input ? readCsv(custom.input) : await defaultStream();

      return compose(
        input,
        transformData((data) => {
          return {
            from: name,
            siret: data.numero_siren_siret_uai,
          };
        })
      );
    },
    async stream() {
      const input = custom.input ? readCsv(custom.input) : await defaultStream();

      return compose(
        input,
        transformData((data) => {
          return {
            from: name,
            selector: data.numero_siren_siret_uai,
            uai_potentiels: [data.numero_uai],
          };
        })
      );
    },
  };
};
