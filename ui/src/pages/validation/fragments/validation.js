const titles = {
  A_VALIDER: "OF-CFA à valider",
  A_RENSEIGNER: "OF-CFA à identifier",
  VALIDE: "OF-CFA validés",
};

export function getValidationTitle(type) {
  return titles[type];
}

export function getValidationType(organisme) {
  return organisme.uai ? "VALIDE" : organisme.uai_potentiels.length > 0 ? "A_VALIDER" : "A_RENSEIGNER";
}

export function buildValidationParams(type) {
  let params = { etat_administratif: "actif", qualiopi: true, types: "of-cfa" };
  switch (type) {
    case "A_VALIDER":
      return { ...params, uai: false, uai_potentiel: true };
    case "VALIDE":
      return { ...params, uai: true };
    case "A_RENSEIGNER":
      return { ...params, uai: false, uai_potentiel: false };
    default:
      throw new Error("Statut de validation inconnu");
  }
}
