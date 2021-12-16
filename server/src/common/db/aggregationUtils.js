//Based on BSON field type comparison
// See https://docs.mongodb.com/manual/reference/bson-type-comparison-order/
// See https://stackoverflow.com/a/25515046/122975

function notEmpty(field) {
  return { $gt: [field, null] };
}

function nullOrEmpty(field) {
  return { $lte: [field, null] };
}
module.exports = {
  nullOrEmpty,
  notEmpty,
};
