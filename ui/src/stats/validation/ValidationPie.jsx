import Pie from "../../common/nivo/Pie";
import React from "react";
import { getValidationColor, getValidationLabel } from "../../common/enums/validation";

export function ValidationPie({ stats }) {
  let national = Object.keys(stats.national).reduce((acc, key) => {
    return [
      ...acc,
      {
        id: key,
        label: getValidationLabel(key),
        value: stats.national[key],
      },
    ];
  }, []);

  return <Pie data={national} getLabel={(id) => getValidationLabel(id)} getColor={(id) => getValidationColor(id)} />;
}
