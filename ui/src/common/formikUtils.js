const yup = require("yup");

function asFormValidation(touched, errors, fieldName) {
  return touched[fieldName] && errors[fieldName] ? { type: "error", message: errors[fieldName] } : {};
}

module.exports = {
  validators: { uai: yup.string().matches(/^[0-9]{7}[A-Z]{1}$/, "L'uai n'est pas au bon format") },
  asFormValidation,
};
