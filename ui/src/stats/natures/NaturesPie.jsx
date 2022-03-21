import { getNatureColor, getNatureLabel } from "../../common/enums/natures";
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
      <Pie data={national} getLabel={(id) => getNatureLabel(id)} getColor={(id) => getNatureColor(id)} />
    </div>
  );
}
