import { Filter } from "./Filter";
import Tooltip from "../../common/Tooltip";
import definitions from "../../common/definitions.json";
import { getNatureLabel } from "../../common/enums/natures";
import React from "react";

export default function NatureFilter({ items }) {
  return (
    <Filter
      label={
        <>
          <span>Nature</span>
          <Tooltip label={"Nature"} description={definitions.nature} />
        </>
      }
      paramName={"natures"}
      items={
        items || [
          { label: getNatureLabel("responsable_formateur"), value: "responsable_formateur" },
          { label: getNatureLabel("formateur"), value: "formateur" },
          { label: getNatureLabel("responsable"), value: "responsable" },
          { label: "N.A", value: false },
        ]
      }
    />
  );
}
