const csv = require("csv-parse");
const { pickBy, isEmpty } = require("lodash");

function parseCsv(options = {}) {
  return csv({
    trim: true,
    delimiter: ";",
    columns: true,
    on_record: (record) => {
      return pickBy(record, (v) => {
        return !isEmpty(v) && v !== "NULL" && v.trim().length;
      });
    },
    ...options,
  });
}

module.exports = {
  parseCsv,
};
