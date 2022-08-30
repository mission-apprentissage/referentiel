import { Filter } from "./Filter.jsx";
import Tooltip from "../../Tooltip.jsx";
import { Box } from "../../Flexbox.jsx";
import React from "react";

export default function UAIFilter() {
  return (
    <Filter
      label={
        <Box>
          <span>UAI validée</span>
          <Tooltip
            label={"UAI validée"}
            description={"L’UAI de cet organisme a été validée les utilisateurs du Référentiel"}
          />
        </Box>
      }
      items={[
        { label: "Oui", paramName: "uais", value: "true" },
        { label: "Non", paramName: "uais", value: "false" },
      ]}
    />
  );
}
