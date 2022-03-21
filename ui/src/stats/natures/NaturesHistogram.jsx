import Histogram from "../Histogram";
import { getNatureColor, getNatureLabel, getNatureKeys } from "../../common/enums/natures";
import React from "react";

export function NaturesHistogram({ stats }) {
  return (
    <div style={{ height: "500px" }}>
      <Histogram
        ariaLabel="Répartition des natures des organisme par académie"
        xLegend={"Académie"}
        yLegend={"Nombre d'organisme"}
        data={stats.academies}
        keys={getNatureKeys()}
        indexBy={({ academie }) => academie.nom}
        getLabel={(id) => getNatureLabel(id)}
        getColor={(id) => getNatureColor(id)}
      />
    </div>
  );
}
