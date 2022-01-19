const { compose, transformData } = require("oleoduc");
const { dbCollection } = require("../../common/db/mongodb");

function buildContacts(email) {
  if (!email) {
    return [];
  }

  return [{ email, confirmé: false }];
}

module.exports = () => {
  let name = "acce";

  return {
    name,
    async stream() {
      return compose(
        dbCollection("acce").find({}, { _search: 0 }).stream(),
        transformData((doc) => {
          if (!doc.uai) {
            return;
          }

          return {
            from: name,
            selector: doc.uai,
            contacts: buildContacts(doc.email),
          };
        })
      );
    },
  };
};
