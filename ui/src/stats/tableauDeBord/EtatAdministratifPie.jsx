import React from "react";
import { useFetch } from "../../common/hooks/useFetch";
import Pie from "../../common/nivo/Pie";
import { getEtatAdministratifColor, getEtatAdministratifLabel } from "../../common/enums/etat_administratif";

export default function EtatAdministratifPie() {
  const [{ data }] = useFetch(`/api/v1/stats/etat_administratif`, []);
  const stats = Object.keys(data).reduce((acc, key) => {
    return [
      ...acc,
      {
        id: key,
        label: getEtatAdministratifLabel(key),
        value: data[key],
      },
    ];
  }, []);

  return (
    <Pie
      data={stats}
      getLabel={(id) => getEtatAdministratifLabel(id)}
      getColor={(id) => getEtatAdministratifColor(id)}
    />
  );
}
