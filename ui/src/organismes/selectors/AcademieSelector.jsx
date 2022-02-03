import Select from "../../common/dsfr/elements/Select";
import { useContext, useState } from "react";
import { Box, Item } from "../../common/Flexbox";
import { DataContext } from "../../common/hooks/useData";
import { useQuery } from "../../common/hooks/useQuery";

export default function AcademieSelector({ onChange }) {
  let [{ academies }] = useContext(DataContext);
  let { query } = useQuery();
  let [selected, setSelected] = useState(query.academie || "");

  return (
    <Box align={"center"} justify={"start"} style={{ width: "100%" }}>
      <span className={"fr-mr-2w xfr-display-xs-none xfr-display-sm-block"}>Filtrer : </span>
      <Item alignSelf={"stretch"} grow={1}>
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
