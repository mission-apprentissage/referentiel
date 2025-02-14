import { Filter } from "./Filter.jsx";
import Tooltip from "../../Tooltip.jsx";
import { Box } from "../../Flexbox.jsx";
import React from "react";

export default function QualiopiFilter() {
  return (
    <Filter
      label={
        <Box align={"end"}>
          <span>Qualiopi</span>
          <Tooltip
            label={"Qualiopi"}
            description={
              "La donnée « Qualiopi » provient de la Liste publique des organismes de formation. Un organisme certifié Qualiopi dans le cadre du Référentiel est habilité à dispenser des formations en apprentissage. La certification Qualiopi est portée par le SIREN + numéro de déclaration d’activité (NDA)."
            }
          />
        </Box>
      }
      items={[
        { label: "Certifié Qualiopi", paramName: "qualiopi", value: "true" },
        { label: "Non certifié Qualiopi", paramName: "qualiopi", value: "false" },
      ]}
    />
  );
}
