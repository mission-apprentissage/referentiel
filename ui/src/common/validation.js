const TITLES = {
  A_VALIDER: "Organismes à vérifier",
  A_RENSEIGNER: "Organismes à identifier",
  VALIDE: "Organismes validés",
};

export function getValidationTitle(type) {
  return TITLES[type];
}

export function getValidationType(organisme) {
  return organisme.uai ? "VALIDE" : organisme.uai_potentiels.length > 0 ? "A_VALIDER" : "A_RENSEIGNER";
}
