import { sortBy } from "lodash-es";

const MAPPER = {
  A_VALIDER: {
    label: "À vérifier",
    color: "#FEECD3",
    order: 2,
    params: {
      etat_administratif: "actif",
      qualiopi: true,
      natures: "responsable,responsable_formateur",
      uais: false,
      uai_potentiels: true,
    },
  },
  A_RENSEIGNER: {
    label: "À identifier",
    color: "#FEE3DD",
    order: 1,
    params: {
      etat_administratif: "actif",
      qualiopi: true,
      natures: "responsable,responsable_formateur",
      uais: true,
    },
  },
  VALIDE: {
    label: "Validés",
    color: "#CEFDDC",
    order: 0,
    params: {
      etat_administratif: "actif",
      qualiopi: true,
      natures: "responsable,responsable_formateur",
      uais: false,
      uai_potentiels: false,
    },
  },
};

export const getValidationTypes = () => sortBy(Object.keys(MAPPER), (key) => MAPPER[key].order);
export const getValidationLabel = (key) => MAPPER[key].label;
export const getValidationColor = (key) => MAPPER[key].color;
export const getValidationParams = (key) => MAPPER[key].params;
