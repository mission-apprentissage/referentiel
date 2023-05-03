import React from "react";
import { useFetch } from "../../common/hooks/useFetch.js";
import Pie from "../../common/nivo/Pie.jsx";
import { getEtatAdministratifColor, getEtatAdministratifLabel } from "../../common/enums/etat_administratif.js";
const config = require("../../config");

export default function EtatAdministratifPie() {
  const [{ data }] = useFetch(config.apiUrl + `/stats/etat_administratif`, []);
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
      label="organismes"
      data={stats}
      getLabel={(id) => getEtatAdministratifLabel(id)}
      getColor={(id) => getEtatAdministratifColor(id)}
    />
  );
}
