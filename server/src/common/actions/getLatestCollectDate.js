const { dbCollection } = require("../db/mongodb.js");

function getLatestCollectDate() {
  return dbCollection("organismes")
    .aggregate([{ $group: { _id: "$_meta.date_collecte" } }, { $sort: { _id: -1 } }])
    .toArray()
    .then((agg) => agg[0]?._id);
}

module.exports = { getLatestCollectDate };
