import { Filter } from "./Filter";

export default function NatureFilter({ items }) {
  return (
    <Filter
      label={"Nature des organismes"}
      paramName={"natures"}
      items={
        items || [
          { code: "formateur|responsable", label: "Responsable et formateur" },
          { code: "formateur|-responsable", label: "Formateur" },
          { code: "-formateur|responsable", label: "Responsable" },
          { code: "-formateur|-responsable", label: "N.A" },
        ]
      }
    />
  );
}
