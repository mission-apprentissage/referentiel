const { oleoduc, transformData, readLineByLine } = require("oleoduc");
const { getOvhFileAsStream } = require("../../common/utils/ovhUtils");

function buildRelations(rattachements) {
  return [
    ...(rattachements.fille || [])
      .filter((f) => f.siret)
      .map((fille) => {
        return {
          siret: fille.siret,
          ...(fille.patronyme ? { label: fille.patronyme } : {}),
          type: "fille",
        };
      }),
    ...(rattachements.mere || [])
      .filter((f) => f.siret)
      .map((mere) => {
        return {
          siret: mere.siret,
          ...(mere.patronyme ? { label: mere.patronyme } : {}),
          type: "mère",
        };
      }),
  ];
}

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

      return oleoduc(
        input,
        readLineByLine(),
        transformData((line) => {
          let { siret, rattachements, email } = JSON.parse(line);
          if (!siret) {
            return;
          }

          return {
            from: name,
            selector: siret,
            relations: buildRelations(rattachements),
            contacts: buildContacts(email),
          };
        }),
        { promisify: false }
      );
    },
  };
};
