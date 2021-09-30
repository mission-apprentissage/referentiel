const { compose, transformData, readLineByLine } = require("oleoduc");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");

function buildContacts(email) {
  if (!email) {
    return [];
  }

  return [{ email, confirmé: false }];
}

module.exports = (custom = {}) => {
  let name = "acce";

  return {
    name,
    async stream() {
      let input = custom.input || (await getOvhFileAsStream("annuaire/acce-2021-09-02.ndjson"));

      return compose(
        input,
        readLineByLine(),
        transformData((line) => {
          let { uai, email } = JSON.parse(line);
          if (!uai) {
            return;
          }

          return {
            from: name,
            selector: uai,
            contacts: buildContacts(email),
          };
        })
      );
    },
  };
};
