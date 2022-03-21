import React from "react";
import { useFetch } from "../../common/hooks/useFetch";
import Histogram from "../../common/nivo/Histogram";

function getLastMonths(nbMonths) {
  let names = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Decembre",
  ];

  let today = new Date();
  let months = [];
  for (let i = nbMonths; i > 0; i -= 1) {
    let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    let year = d.getFullYear();
    months.push({ label: names[d.getMonth()], mois: d.getMonth() + 1, annee: year });
  }

  return months;
}

export default function NouveauxHistogram() {
  let [{ data }] = useFetch(`/api/v1/stats/nouveaux`, []);
  let last6Months = getLastMonths(6).map(({ annee, mois, label }) => {
    let found = data.find((e) => e.annee === annee && e.mois === mois);

    return {
      key: `${annee}_${label}`,
      nbOrganismes: found?.total || 0,
    };
  });

  let customXLegend = {
    tickSize: 0,
    tickPadding: 25,
    tickRotation: -25,
    legend: "6 derniers mois",
    legendPosition: "middle",
    legendOffset: 100,
    format: (id) => id.split("_").reverse().join(" "),
  };

  return (
    <div style={{ height: "500px" }}>
      <Histogram
        title="Entrants sur les 6 derniers mois"
        yLegend={"Oorganismes"}
        data={last6Months}
        series={["nbOrganismes"]}
        getSerieLabel={() => "Nouveaux organismes"}
        getSerieColor={() => "#0063CB"}
        axisBottom={customXLegend}
      />
    </div>
  );
}
