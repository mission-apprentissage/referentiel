import { Filter } from "./Filter.jsx";
import Tooltip from "../../Tooltip.jsx";
import { Box } from "../../Flexbox.jsx";
import React from "react";

export default function SiretFilter() {
  return (
    <Filter
      label={
        <Box>
          <span>SIRET</span>
          <Tooltip
            label={"SIRET"}
            description={"L'état administratif de l'organisme de formation provient de l'INSEE"}
          />
        </Box>
      }
      items={[
        { label: "En activité", paramName: "etat_administratif", value: "actif" },
        { label: "Fermé", paramName: "etat_administratif", value: "fermé" },
      ]}
    />
  );
}