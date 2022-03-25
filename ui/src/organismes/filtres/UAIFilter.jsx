import { Filter } from "./Filter";
import Tooltip from "../../common/Tooltip";
import { Box } from "../../common/Flexbox";
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
