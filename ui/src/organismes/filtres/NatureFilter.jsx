import { Filter } from "./Filter";
import Tooltip from "../../common/Tooltip";
import definitions from "../../common/definitions.json";
import { getNatureLabel } from "../../common/natures";

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
          { code: "responsable_formateur", label: getNatureLabel("responsable_formateur") },
          { code: "formateur", label: getNatureLabel("formateur") },
          { code: "responsable", label: getNatureLabel("responsable") },
          { code: false, label: "N.A" },
        ]
      }
    />
  );
}
