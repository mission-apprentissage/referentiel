const titles = {
  A_VALIDER: "Organismes à valider",
  A_RENSEIGNER: "Organismes à identifier",
  VALIDE: "Organismes validés",
};

export function getValidationTitle(type) {
  return titles[type];
}

export function getValidationType(organisme) {
  return organisme.uai ? "VALIDE" : organisme.uai_potentiels.length > 0 ? "A_VALIDER" : "A_RENSEIGNER";
}

export function buildValidationParams(type) {
  let params = { etat_administratif: "actif", qualiopi: true, natures: "formateur|responsable" };
  switch (type) {
    case "A_VALIDER":
      return { ...params, uai: false, uai_potentiels: true };
    case "VALIDE":
      return { ...params, uai: true };
    case "A_RENSEIGNER":
      return { ...params, uai: false, uai_potentiels: false };
    default:
      throw new Error("Statut de validation inconnu");
  }
}
