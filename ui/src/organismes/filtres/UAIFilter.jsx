import { Filter } from "./Filter";
import Tooltip from "../../common/Tooltip";
import { Box } from "../../common/Flexbox";

export default function UAIFilter() {
  return (
    <Filter
      label={
        <Box>
          <span>UAI validée</span>
          <Tooltip message={"L’UAI de cet organisme a été validée les utilisateurs du Référentiel"} />
        </Box>
      }
      paramName={"uais"}
      items={[
        { code: "true", label: "Oui" },
        { code: "false", label: "Non" },
      ]}
    />
  );
}
