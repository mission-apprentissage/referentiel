import Histogram from "../Histogram";
import React from "react";
import { getValidationColor, getValidationLabel, getValidationValues } from "../../common/validation";

export function ValidationHistogram({ stats }) {
  return (
    <div style={{ height: "500px" }}>
      <Histogram
        data={stats.academies}
        indexBy={({ academie }) => academie.nom}
        ariaLabel="Répartition des natures des organisme par académie"
        xLegend={"Académie"}
        yLegend={"Nombre d'organisme"}
        keys={getValidationValues()}
        colors={({ id }) => getValidationColor(id)}
        legendLabel={({ id }) => getValidationLabel(id)}
        getTooltipLabel={({ id }) => getValidationLabel(id)}
      />
    </div>
  );
}
