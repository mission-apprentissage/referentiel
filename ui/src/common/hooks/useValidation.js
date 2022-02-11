import { AuthContext } from "../AuthRoutes";
import { useContext } from "react";
import { useOrganismes } from "./useOrganismes";

export function useValidation(type, custom = {}) {
  let [auth] = useContext(AuthContext);
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
