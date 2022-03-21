import Pie from "../Pie";
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

  return (
    <div style={{ height: "500px" }}>
      <Pie data={national} getLabel={(id) => getValidationLabel(id)} getColor={(id) => getValidationColor(id)} />
    </div>
  );
}
