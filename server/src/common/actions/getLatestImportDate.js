const { dbCollection } = require("../db/mongodb.js");

function getLatestImportDate() {
  return dbCollection("organismes")
    .aggregate([{ $group: { _id: "$_meta.date_dernier_import" } }, { $sort: { _id: -1 } }])
    .toArray()
    .then((agg) => agg[0]?._id);
}

module.exports = { getLatestImportDate };
