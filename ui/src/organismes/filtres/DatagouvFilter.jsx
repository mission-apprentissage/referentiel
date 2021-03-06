import { Filter } from "./Filter";
import Tooltip from "../../common/Tooltip";
import { Box } from "../../common/Flexbox";
import React from "react";

export default function DatagouvFilter() {
  return (
    <Filter
      label={
        <Box align={"end"}>
          <span>Liste publique des organismes de formation</span>
          <Tooltip
            label={"Liste publique des organismes de formation"}
            description={"L'organisme est présent dans la Liste publique des Organisme de Formation (base data.gouv)"}
          />
        </Box>
      }
      items={[
        { label: "Oui", paramName: "referentiels", value: "datagouv" },
        { label: "Qualiopi", paramName: "qualiopi", value: "true" },
        { label: "Non", paramName: "referentiels", value: "-datagouv" },
      ]}
    />
  );
}
