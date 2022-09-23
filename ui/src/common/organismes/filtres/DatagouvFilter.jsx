import { Filter } from "./Filter.jsx";
import Tooltip from "../../Tooltip.jsx";
import { Box } from "../../Flexbox.jsx";
import React from "react";

export default function DatagouvFilter() {
  return (
    <Filter
      label={
        <Box align={"end"}>
          <span>Liste publique des organismes de formation</span>
          <Tooltip
            label={"Liste publique des organismes de formation"}
            description={
              "La certification qualiopi est portée par le SIREN + numéro de déclaration d’activité (NDA) ." +
              "Il est possible que des sirets soient absents de la liste publique des OF mais hérite de la certification qualiopi via leur SIREN + NDA de rattachement."
            }
          />
        </Box>
      }
      items={[
        { label: "Présent", paramName: "referentiels", value: "datagouv" },
        { label: "Qualiopi", paramName: "qualiopi", value: "true" },
        { label: "Non présent", paramName: "referentiels", value: "-datagouv" },
      ]}
    />
  );
}
