import Histogram from "../../common/nivo/Histogram";
import React from "react";
import { getValidationColor, getValidationLabel, getValidationTypes } from "../../common/enums/validation";

export function ValidationHistogram({ stats }) {
  return (
    <Histogram
      title="Répartition des natures des organisme par académie"
      xLegend={"Académie"}
      yLegend={"Nombre d'organisme"}
      data={stats.academies.map((a) => ({ ...a, pouet: "tutu" }))}
      series={getValidationTypes()}
      getSerieLabel={(id) => getValidationLabel(id)}
      getSerieColor={(id) => getValidationColor(id)}
      groupBy={({ academie }) => academie.nom}
      onClick={(selected) => {
        console.log(selected.id, selected.data);
      }}
    />
  );
}
