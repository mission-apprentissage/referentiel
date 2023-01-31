const { compose, transformData } = require("oleoduc");
const TableauDeBordApi = require("../../common/apis/TableauDeBordApi");
const { uniq } = require("lodash");

const RESEAU_LABELS = {
  cfa_ec: "Enseignement catholique",
  COMP_DU_DEVOIR: "Compagnons du devoir",
};

module.exports = (custom = {}) => {
  const name = "tableau-de-bord";
  const api = custom.tableauDeBordApi || new TableauDeBordApi();

  return {
    name,
    async stream() {
      return compose(
        await api.streamReseaux(),
        transformData(
          ({ siret, uai, reseaux }) => {
            return {
              from: name,
              selector: siret,
              ...(uai ? { uai_potentiels: [uai] } : {}),
              ...(reseaux
                ? {
                    reseaux:
                      uniq(reseaux).map((r) => {
                        const code = r.toLowerCase();
                        return { code, label: RESEAU_LABELS[code] || code };
                      }) || [],
                  }
                : {}),
            };
          },
          { parallel: 10 }
        )
      );
    },
  };
};
