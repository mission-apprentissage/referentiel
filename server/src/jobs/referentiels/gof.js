const { oleoduc, transformData, filterData, mergeStreams } = require("oleoduc");
const { createSource } = require("../sources/sources");

module.exports = () => {
  return {
    name: "gof",
    stream: async function () {
      let inputs = await Promise.all(
        ["deca", "catalogue", "sifa-ramsese"].map((name) => {
          let source = createSource(name);
          return source.stream();
        })
      );

      return oleoduc(
        mergeStreams(inputs),
        filterData((data) => data.selector),
        transformData((data) => {
          return {
            from: data.from,
            siret: data.selector,
          };
        }),
        { promisify: false }
      );
    },
  };
};
