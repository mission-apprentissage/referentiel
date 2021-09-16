const fs = require("fs");

let sources = fs.readdirSync(__dirname).reduce((acc, filename) => {
  let type = filename.split(".")[0];

  return {
    ...acc,
    [type]: require(`./${filename}`),
  };
}, {});

function createSource(name, options) {
  let create = sources[name];
  if (!create) {
    throw new Error(`La source '${name}' n'existe pas`);
  }

  return create(options);
}

module.exports = {
  createSource,
};
