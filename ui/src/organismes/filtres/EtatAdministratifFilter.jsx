import { Filter } from "./Filter";

export default function EtatAdministratifFilter() {
  return (
    <Filter
      label={"Statut du siret"}
      paramName={"etat_administratif"}
      items={[
        { code: "actif", label: "en activité" },
        { code: "fermé", label: "fermé" },
      ]}
    />
  );
}
