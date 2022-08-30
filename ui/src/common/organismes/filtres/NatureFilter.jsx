import { Filter } from "./Filter.jsx";
import Tooltip from "../../Tooltip.jsx";
import definitions from "../../definitions.json";
import { getNatureLabel } from "../../enums/natures.js";
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
      items={
        items || [
          { label: getNatureLabel("responsable_formateur"), paramName: "natures", value: "responsable_formateur" },
          { label: getNatureLabel("formateur"), paramName: "natures", value: "formateur" },
          { label: getNatureLabel("responsable"), paramName: "natures", value: "responsable" },
          { label: "N.A", paramName: "natures", value: "inconnue" },
        ]
      }
    />
  );
}
