const fs = require("fs");

const sources = fs.readdirSync(__dirname).reduce((acc, filename) => {
  const type = filename.split(".")[0];

  return {
    ...acc,
    [type]: require(`./${filename}`),
  };
}, {});

function createSource(name, options) {
  const create = sources[name];
  if (!create) {
    throw new Error(`La source '${name}' n'existe pas`);
  }

  return create(options);
}

module.exports = {
  createSource,
};
