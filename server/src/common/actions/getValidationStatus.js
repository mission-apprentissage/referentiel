function getValidationStatus(organisme) {
  return organisme.uai ? "VALIDE" : organisme.uai_potentiels.length > 0 ? "A_VALIDER" : "A_RENSEIGNER";
}

module.exports = getValidationStatus;
