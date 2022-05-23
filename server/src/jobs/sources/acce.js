const { compose, transformData } = require("oleoduc");
const { dbCollection } = require("../../common/db/mongodb");

function buildContacts(email) {
  if (!email) {
    return [];
  }

  return [{ email, confirmé: false }];
}

module.exports = () => {
  const name = "acce";

  return {
    name,
    async stream() {
      return compose(
        dbCollection("acce").find({}).stream(),
        transformData((doc) => {
          return {
            from: name,
            selector: doc.numero_uai,
            contacts: buildContacts(doc.mel_uai),
          };
        })
      );
    },
  };
};
