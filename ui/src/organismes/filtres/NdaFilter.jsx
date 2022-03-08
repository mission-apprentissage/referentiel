import { Filter } from "./Filter";
import Tooltip from "../../common/Tooltip";
import { Box } from "../../common/Flexbox";

export default function NdaFilter() {
  return (
    <Filter
      label={
        <Box align={"end"}>
          <span>Déclaré en tant qu'Organisme Formateur</span>
          <Tooltip
            message={"L'organisme est présent dans la Liste publique des Organisme de Formation (base data.gouv)"}
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
