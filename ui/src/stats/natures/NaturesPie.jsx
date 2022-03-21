import { getNatureColor, getNatureLabel } from "../../common/enums/natures";
import Pie from "../../common/nivo/Pie";
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

  return <Pie data={national} getLabel={(id) => getNatureLabel(id)} getColor={(id) => getNatureColor(id)} />;
}
