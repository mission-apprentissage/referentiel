import Histogram from "../../common/nivo/Histogram";
import { getNatureColor, getNatureLabel, getNatureTypes } from "../../common/enums/natures";
import React from "react";

export function NaturesHistogram({ stats }) {
  return (
    <Histogram
      title="Répartition des natures des organisme par académie"
      xLegend={"Académie"}
      yLegend={"Nombre d'organisme"}
      data={stats.academies}
      series={getNatureTypes()}
      getSerieLabel={(id) => getNatureLabel(id)}
      getSerieColor={(id) => getNatureColor(id)}
      groupBy={({ academie }) => academie.nom}
    />
  );
}
