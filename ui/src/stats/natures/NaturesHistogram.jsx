import Histogram from "../Histogram";
import { getNatureColor, getNatureLabel, getNatureValues } from "../../common/natures";
import React from "react";

export function NaturesHistogram({ stats }) {
  return (
    <div style={{ height: "500px" }}>
      <Histogram
        data={stats.academies}
        indexBy={({ academie }) => academie.nom}
        ariaLabel="Répartition des natures des organisme par académie"
        xLegend={"Académie"}
        yLegend={"Nombre d'organisme"}
        keys={getNatureValues()}
        colors={({ id }) => getNatureColor(id)}
        legendLabel={({ id }) => getNatureLabel(id)}
        getTooltipLabel={({ id }) => getNatureLabel(id)}
      />
    </div>
  );
}
