import { sortBy } from "lodash-es";

const MAPPER = {
  A_VALIDER: { label: "À vérifier", color: "#FEECD3", order: 2 },
  A_RENSEIGNER: { label: "À identifier", color: "#FEE3DD", order: 1 },
  VALIDE: { label: "Validés", color: "#CEFDDC", order: 0 },
};

export const getValidationKeys = () => sortBy(Object.keys(MAPPER), (key) => MAPPER[key].order);
export const getValidationLabel = (key) => MAPPER[key].label;
export const getValidationColor = (key) => MAPPER[key].color;
