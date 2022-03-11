const { pickBy, cloneDeepWith, isNil, isPlainObject } = require("lodash");

function omitNil(obj) {
  return pickBy(obj, (v) => !isNil(v));
}

function omitDeep(collection, callback) {
  function clone(value) {
    if (isPlainObject(value)) {
      let keysToDelete = callback(value);
      keysToDelete.forEach((key) => {
        delete value[key];
      });
    }
  }
  return cloneDeepWith(collection, clone);
}

function omitDeepNil(obj) {
  return omitDeep(obj, (value) =>
    Object.keys(value)
      .map((k) => (isNil(value[k]) ? k : null))
      .filter((k) => k)
  );
}

function flattenObject(obj, parent, res = {}) {
  for (let key in obj) {
    let propName = parent ? parent + "." + key : key;
    if (typeof obj[key] == "object" && !Array.isArray(obj[key]) && !(obj[key] instanceof Date)) {
      flattenObject(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}

function isError(obj) {
  return obj && obj.stack && obj.message;
}

function optionalItem(key, value) {
  return value ? [{ [key]: value }] : [];
}

module.exports = {
  flattenObject,
  omitNil,
  isError,
  optionalItem,
  omitDeep,
  omitDeepNil,
};
