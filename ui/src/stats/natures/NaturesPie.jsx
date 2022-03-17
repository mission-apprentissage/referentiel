import { getNatureColor, getNatureLabel } from "../../common/natures";
import Pie from "../Pie";
import React from "react";

export function NaturesPie({ stats }) {
  let national = Object.keys(stats.national).reduce((acc, key) => {
    return [
      ...acc,
      {
        id: key,
        label: getNatureLabel(key),
        value: stats.national[key],
      },
    ];
  }, []);

  return (
    <div style={{ height: "500px" }}>
      <Pie data={national} colors={({ id }) => getNatureColor(id)} arcLinkLabel={(d) => getNatureLabel(d.id)} />
    </div>
  );
}
