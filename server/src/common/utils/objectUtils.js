const { mergeWith, isArray, pickBy, isEmpty } = require("lodash");

function omitEmpty(obj) {
  return pickBy(obj, (v) => !isEmpty(v));
}

function flattenObject(obj, parent, res = {}) {
  for (let key in obj) {
    let propName = parent ? parent + "." + key : key;
    if (typeof obj[key] == "object" && !Array.isArray(obj[key])) {
      flattenObject(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}

function mergeObjectsAndConcatArray(...args) {
  return mergeWith(...args, function (a, b) {
    if (isArray(a)) {
      return a.concat(b);
    }
  });
}

function isError(obj) {
  return obj && obj.stack && obj.message;
}

function optionalItem(key, value) {
  return value ? [{ [key]: value }] : [];
}

function optionalObject(key, value) {
  return value ? { [key]: value } : {};
}

module.exports = {
  flattenObject,
  omitEmpty,
  mergeObjectsAndConcatArray,
  isError,
  optionalItem,
  optionalObject,
};
