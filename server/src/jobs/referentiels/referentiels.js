const fs = require("fs");

const referentiels = fs.readdirSync(__dirname).reduce((acc, filename) => {
  let type = filename.split(".")[0];

  return {
    ...acc,
    [type]: require(`./${filename}`),
  };
}, {});

function createReferentiel(type, ...args) {
  return referentiels[type](...args);
}

module.exports = {
  createReferentiel,
};
