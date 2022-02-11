import { Filter } from "./Filter";

export default function NdaFilter() {
  return (
    <Filter
      label={"Déclaré en tant qu'Organisme Formateur"}
      paramName={"numero_declaration_activite"}
      items={[
        { code: "true", label: "Oui" },
        { code: "false", label: "Non" },
      ]}
    />
  );
}
