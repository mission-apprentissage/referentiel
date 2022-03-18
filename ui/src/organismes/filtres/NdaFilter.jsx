import { Filter } from "./Filter";
import Tooltip from "../../common/Tooltip";
import { Box } from "../../common/Flexbox";
import React from "react";

export default function NdaFilter() {
  return (
    <Filter
      label={
        <Box align={"end"}>
          <span>Déclaré en tant qu'Organisme Formateur</span>
          <Tooltip
            label={"Déclaré en tant qu'Organisme Formateur"}
            description={"L'organisme est présent dans la Liste publique des Organisme de Formation (base data.gouv)"}
          />
        </Box>
      }
      paramName={"numero_declaration_activite"}
      items={[
        { code: "true", label: "Oui" },
        { code: "false", label: "Non" },
      ]}
    />
  );
}
