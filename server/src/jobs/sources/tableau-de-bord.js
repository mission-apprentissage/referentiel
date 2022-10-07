const { compose, transformData, flattenArray } = require("oleoduc");
const TableauDeBordApi = require("../../common/apis/TableauDeBordApi");

const RESEAU_LABELS = {
  "cfa ec": "Enseignement catholique",
  "compagnons-du-devoir": "Compagnons du devoir",
};

module.exports = (custom = {}) => {
  const name = "tableau-de-bord";
  const api = custom.tableauDeBordApi || new TableauDeBordApi();

  return {
    name,
    async stream() {
      return compose(
        await api.streamCfas({}, { limit: 10000 }),
        transformData((data) => {
          if (!data.sirets) {
            return null;
          }

          return data.sirets.map((siret) => {
            return {
              from: name,
              selector: siret,
              uai_potentiels: [data.uai],
              reseaux:
                data.reseaux?.map((r) => {
                  const code = r.toLowerCase();
                  return { code, label: RESEAU_LABELS[code] || code };
                }) || [],
            };
          });
        }),
        flattenArray()
      );
    },
  };
};
