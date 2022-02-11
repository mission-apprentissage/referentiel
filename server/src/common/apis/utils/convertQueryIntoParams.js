const queryString = require("query-string");

function convertQueryIntoParams(query, options = {}) {
  return queryString.stringify(
    {
      query: JSON.stringify(query),
      ...Object.keys(options).reduce((acc, key) => {
        return {
          ...acc,
          [key]: JSON.stringify(options[key]),
        };
      }, {}),
    },
    { encode: false }
  );
}

module.exports = convertQueryIntoParams;
