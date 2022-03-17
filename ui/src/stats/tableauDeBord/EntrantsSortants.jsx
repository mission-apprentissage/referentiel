import React from "react";
import { useFetch } from "../../common/hooks/useFetch";
import Histogram from "../Histogram";

function getLastMonths() {
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
  for (let i = 6; i > 0; i -= 1) {
    let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    let year = d.getFullYear();
    months.push({ label: names[d.getMonth()], mois: d.getMonth() + 1, annee: year });
  }

  return months;
}

function getHistogramData(data) {
  return getLastMonths().map((item) => {
    let entrants = data.entrants.find((e) => e.annee === item.annee && e.mois === item.mois);
    let sortants = data.sortants.find((s) => s.annee === item.annee && s.mois === item.mois);

    return {
      ...item,
      key: `${item.annee}_${item.label}`,
      entrants: entrants?.total || 0,
      sortants: sortants?.total || 0,
    };
  });
}
export default function EntrantsSortant() {
  let [{ data }] = useFetch(`/api/v1/stats/entrants_sortants`, { entrants: [], sortants: [] });
  let colors = {
    entrants: "#0063CB",
    sortants: "#B6CFFB",
  };

  return (
    <div style={{ height: "500px" }}>
      <Histogram
        ariaLabel="Entrants et sortant sur les 6 derniers mois"
        yLegend={"Nombre d'organisme"}
        keys={["entrants", "sortants"]}
        data={getHistogramData(data)}
        colors={({ id }) => colors[id]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 25,
          tickRotation: -25,
          legend: "6 derniers mois",
          legendPosition: "middle",
          legendOffset: 100,
          format: (key) => key.split("_").reverse().join(" "),
        }}
      />
    </div>
  );
}
