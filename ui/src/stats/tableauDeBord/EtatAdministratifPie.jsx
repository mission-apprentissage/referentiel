import React from "react";
import { useFetch } from "../../common/hooks/useFetch";
import Pie from "../Pie";

const MAPPER = {
  actif: { label: "En activité", color: "#0f9d58" },
  fermé: { label: "Fermé", color: "#e1000f" },
};

export default function EtatAdministratifPie() {
  let [{ data }] = useFetch(`/api/v1/stats/etat_administratif`, []);
  let stats = Object.keys(data).reduce((acc, key) => {
    return [
      ...acc,
      {
        id: key,
        label: MAPPER[key].label,
        value: data[key],
      },
    ];
  }, []);

  return (
    <div style={{ height: "500px" }}>
      <Pie data={stats} getLabel={(id) => MAPPER[id].label} getColor={(id) => MAPPER[id].color} />
    </div>
  );
}
