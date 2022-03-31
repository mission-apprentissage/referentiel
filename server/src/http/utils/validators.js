const Joi = require("@hapi/joi");

const customJoi = Joi.extend((joi) => ({
  type: "arrayOf",
  base: joi.array(),
  // eslint-disable-next-line no-unused-vars
  coerce(value, helpers) {
    return { value: value.split ? value.split(",") : value };
  },
}));

function arrayOf(itemSchema = Joi.string()) {
  return customJoi.arrayOf().items(itemSchema).single();
}

function password() {
  return Joi.string().regex(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/
  );
}

function pagination() {
  return {
    items_par_page: Joi.number().default(10),
    page: Joi.number().default(1),
  };
}

function tri() {
  return {
    ordre: Joi.string().valid("asc", "desc").default("desc"),
  };
}

function exports() {
  return {
    ext: Joi.string().valid("json", "csv", "xls").default("json"),
  };
}

function champs() {
  return {
    champs: arrayOf(Joi.string()).default([]),
  };
}

module.exports = {
  arrayOf,
  password,
  pagination,
  tri,
  champs,
  exports,
};
