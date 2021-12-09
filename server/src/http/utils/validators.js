const Joi = require("@hapi/joi");

const customJoi = Joi.extend((joi) => ({
  type: "stringList",
  base: joi.array(),
  // eslint-disable-next-line no-unused-vars
  coerce(value, helpers) {
    return { value: value.split ? value.split(",") : value };
  },
}));

module.exports = {
  stringList: (itemSchema = Joi.string()) => customJoi.stringList().items(itemSchema).single(),
  password: () =>
    // https://owasp.org/www-community/password-special-characters
    Joi.string().regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/
    ),
};
