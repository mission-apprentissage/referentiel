import { Filter } from "./Filter";
import Tooltip from "../../common/Tooltip";
import definitions from "../../common/definitions.json";
import { Box } from "../../common/Flexbox";

export default function NatureFilter({ items }) {
  return (
    <Filter
      label={
        <Box>
          <span>Nature</span>
          <Tooltip message={definitions.nature} />
        </Box>
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
