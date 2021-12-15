import Select from "../../../common/components/dsfr/elements/Select";
import { useState } from "react";
import useNavigation from "../../../common/hooks/useNavigation";
import { Box, Item } from "../../../common/components/Flexbox";
import { useData } from "../../../common/hooks/useData";

export default function AcademieSelector({ onChange }) {
  let { params } = useNavigation();
  let [{ academies }] = useData();
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
