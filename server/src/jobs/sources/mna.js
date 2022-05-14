const { compose, transformData } = require("oleoduc");
const { Readable } = require("stream");

module.exports = (custom = {}) => {
  const name = "mna";
  const array = [{ siret: "19750707200035", uai: "0755111Y" }];

  return {
    name,
    async referentiel() {
      const stream = custom.input || Readable.from(array);

      return compose(
        stream,
        transformData((data) => {
          return {
            from: name,
            ...data,
          };
        })
      );
    },
    async stream() {
      const stream = custom.input || Readable.from(array);

      return compose(
        stream,
        transformData((data) => {
          return {
            from: name,
            selector: data.siret,
            data: { uai: data.uai },
          };
        })
      );
    },
  };
};
