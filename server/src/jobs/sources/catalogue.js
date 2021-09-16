const { oleoduc, transformData } = require("oleoduc");
const { getCollection } = require("../../common/db/mongodb");

module.exports = () => {
  let name = "catalogue";

  return {
    name,
    stream() {
      return oleoduc(
        getCollection("etablissements").find({}, { siret: 1, uai: 1 }).stream(),
        transformData((etablissement) => {
          return {
            from: name,
            selector: etablissement.siret.trim(),
            uais: [etablissement.uai || undefined],
          };
        }),
        { promisify: false }
      );
    },
  };
};
