import { Filter } from "./Filter";
import Tooltip from "../../common/Tooltip";
import definitions from "../../common/definitions.json";

export default function NatureFilter({ items }) {
  return (
    <Filter
      label={
        <>
          <span>Nature</span>
          <Tooltip message={definitions.nature} />
        </>
      }
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
