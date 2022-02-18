import { useOrganismes } from "./useOrganismes";
import { ApiContext } from "../ApiProvider";
import { useContext } from "react";

export function useValidation(type, custom = {}) {
  let { auth } = useContext(ApiContext);
  let params = {
    [`${auth.type}s`]: auth.code,
    etat_administratif: "actif",
    qualiopi: true,
    natures: "-formateur|responsable,formateur|responsable",
    ...custom,
  };

  switch (type) {
    case "A_VALIDER":
      params.uais = false;
      params.uai_potentiels = true;
      break;
    case "VALIDE":
      params.uais = true;
      break;
    case "A_RENSEIGNER":
      params.uais = false;
      params.uai_potentiels = false;
      break;
    default:
      throw new Error(`Type de validation inconnu : ${type}`);
  }

  return useOrganismes(params);
}
