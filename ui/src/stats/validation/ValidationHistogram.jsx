import Histogram from "../Histogram";
import React from "react";
import { getValidationColor, getValidationLabel, getValidationKeys } from "../../common/enums/validation";

export function ValidationHistogram({ stats }) {
  return (
    <div style={{ height: "500px" }}>
      <Histogram
        ariaLabel="Répartition des natures des organisme par académie"
        xLegend={"Académie"}
        yLegend={"Nombre d'organisme"}
        data={stats.academies}
        keys={getValidationKeys()}
        indexBy={({ academie }) => academie.nom}
        getLabel={(id) => getValidationLabel(id)}
        getColor={(id) => getValidationColor(id)}
      />
    </div>
  );
}
