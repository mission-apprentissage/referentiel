import Select from "../../../common/dsfr/elements/Select";
import { useState } from "react";
import useNavigation from "../../../common/navigation/useNavigation";
import { Box, Item } from "../../../common/Flexbox";
import { useDataContext } from "../../../common/data/useDataContext";

export default function AcademieSelector({ onChange }) {
  let { params } = useNavigation();
  let [{ academies }] = useDataContext();
  let [selected, setSelected] = useState(params.academie || "");

  return (
    <Box align={"center"} justify={"start"}>
      <span className={"fr-mr-2w"} style={{ width: "20%" }}>
        Filtrer :{" "}
      </span>
      <Item alignSelf={"stretch"} style={{ width: "80%" }}>
        <Select
          value={selected}
          onChange={(e) => {
            let code = e.target.value;
            setSelected(code);
            return onChange(code);
          }}
        >
          <option value="">Tous les académies</option>
          {academies.map((dep, index) => {
            let code = dep.code;
            return (
              <option key={index} value={code}>
                {dep.nom}
              </option>
            );
          })}
        </Select>
      </Item>
    </Box>
  );
}
