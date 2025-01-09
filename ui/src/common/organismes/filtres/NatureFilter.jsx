import { Filter } from "./Filter.jsx";
import Tooltip from "../../Tooltip.jsx";
import { getNatureLabel } from "../../enums/natures.js";
import React from "react";

export default function NatureFilter({ items }) {
  return (
    <Filter
      label={
        <>
          <span>Nature</span>
          <Tooltip
            label={"Nature"}
            description="Désigne la nature de l’organisme de formation qui peut être Responsable / Responsable et formateur / ou Formateur uniquement. Cette donnée est déduite de la manière dont l’offre de formation est déclarée dans les bases des Carif-Oref."
          />
        </>
      }
      items={
        items || [
          { label: getNatureLabel("responsable_formateur"), paramName: "natures", value: "responsable_formateur" },
          { label: getNatureLabel("formateur"), paramName: "natures", value: "formateur" },
          { label: getNatureLabel("responsable"), paramName: "natures", value: "responsable" },
          { label: "Nature inconnue", paramName: "natures", value: "inconnue" },
        ]
      }
    />
  );
}
