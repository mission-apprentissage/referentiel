//Based on BSON field type comparison
// See https://docs.mongodb.com/manual/reference/bson-type-comparison-order/
// See https://stackoverflow.com/a/25515046/122975
function notEmpty(field) {
  return { $gt: [field, null] };
}

function nullOrEmpty(field) {
  return { $lte: [field, null] };
}

function arrayHasElements(field) {
  return { $gte: [{ $size: field }, 1] };
}

function arrayIsEmpty(field) {
  return { $eq: [{ $size: field }, 0] };
}

function arrayContains(field, array) {
  return { $setIsSubset: [array, field] };
}

function sum(condition) {
  return {
    $cond: {
      if: condition,
      then: 1,
      else: 0,
    },
  };
}

module.exports = {
  nullOrEmpty,
  notEmpty,
  arrayHasElements,
  arrayIsEmpty,
  arrayContains,
  sum,
};
