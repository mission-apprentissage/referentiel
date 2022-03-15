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
          { code: "responsable_formateur", label: "Responsable et formateur" },
          { code: "formateur", label: "Formateur" },
          { code: "responsable", label: "Responsable" },
          { code: false, label: "N.A" },
        ]
      }
    />
  );
}
