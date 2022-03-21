import Histogram from "../Histogram";
import { getNatureColor, getNatureLabel, getNatureKeys } from "../../common/natures";
import React from "react";

export function NaturesHistogram({ stats }) {
  return (
    <div style={{ height: "500px" }}>
      <Histogram
        ariaLabel="Répartition des natures des organisme par académie"
        xLegend={"Académie"}
        yLegend={"Nombre d'organisme"}
        data={stats.academies}
        indexBy={({ academie }) => academie.nom}
        keys={getNatureKeys()}
        getLabel={(id) => getNatureLabel(id)}
        getColor={(id) => getNatureColor(id)}
      />
    </div>
  );
}
