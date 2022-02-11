import { Filter } from "./Filter";

export default function RelationFilter({ items, ...rest }) {
  return (
    <Filter
      label={"Type de relation"}
      paramName={"relations"}
      items={
        items || [
          { code: "responsable->formateur", label: "Délègue à" },
          { code: "formateur->responsable", label: "Dispense pour" },
          { code: "entreprise", label: "Fait parti de la même entreprise" },
        ]
      }
      {...rest}
    />
  );
}
