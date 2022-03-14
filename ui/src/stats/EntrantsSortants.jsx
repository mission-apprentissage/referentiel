import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useFetch } from "../common/hooks/useFetch";

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

function getHistogram(data) {
  return getLastMonths().map((item) => {
    let entrants = data.entrants.find((e) => e.annee === item.annee && e.mois === item.mois);
    let sortants = data.sortants.find((s) => s.annee === item.annee && s.mois === item.mois);

    return {
      ...item,
      key: `${item.annee}_${item.label}`,
      entrants: entrants?.total || 0,
      entrants_color: "#0063CB",
      sortants: sortants?.total || 0,
      sortants_color: "#B6CFFB",
    };
  });
}
export default function EntrantsSortant() {
  let [{ data }] = useFetch(`/api/v1/stats/entrants_sortants`, { entrants: [], sortants: [] });

  return (
    <div style={{ height: "500px" }}>
      <ResponsiveBar
        role="application"
        ariaLabel="Entrants et sortant sur les 6 derniers mois"
        data={getHistogram(data)}
        indexBy={"key"}
        keys={["entrants", "sortants"]}
        enableGridY={false}
        theme={{ background: "#F9F8F6" }}
        margin={{ top: 75, right: 100, bottom: 125, left: 100 }}
        padding={0.6}
        colors={({ id, data }) => String(data[`${id}_color`])}
        enableLabel={false}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 25,
          tickRotation: -25,
          legend: "6 derniers mois",
          legendPosition: "middle",
          legendOffset: 100,
          format: (key) => key.split("_").reverse().join(" "),
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Nombre d'organisme",
          legendPosition: "middle",
          legendOffset: -75,
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "top-left",
            direction: "row",
            justify: false,
            translateY: -50,
            translateX: -75,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}
