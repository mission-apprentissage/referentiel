const MAPPER = {
  A_VALIDER: { label: "À vérifier", color: "#FEECD3" },
  A_RENSEIGNER: { label: "À identifier", color: "#FEE3DD" },
  VALIDE: { label: "Validés", color: "#CEFDDC" },
};

export const getValidationLabel = (id) => MAPPER[id].label;
export const getValidationColor = (id) => MAPPER[id].color;
export const getValidationValues = () => Object.keys(MAPPER);
