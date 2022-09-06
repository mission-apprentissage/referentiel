import Select from "../../dsfr/elements/Select.jsx";
import { useContext, useState } from "react";
import { Box, Item } from "../../Flexbox.jsx";
import { DataContext } from "../../DataProvider.jsx";

export default function AcademieSelector({ academie, onChange }) {
  const { academies } = useContext(DataContext);
  const [selected, setSelected] = useState(academie || "");

  return (
    <Box align={"center"} justify={"start"} style={{ width: "100%" }}>
      <span className={"fr-mr-2w xfr-display-xs-none xfr-display-sm-block"}>Filtrer : </span>
      <Item alignSelf={"stretch"} grow={1}>
        <Select
          value={selected}
          onChange={(e) => {
            const code = e.target.value;
            setSelected(code);
            return onChange(code);
          }}
        >
          <option value="">Tous les académies</option>
          {academies.map((dep, index) => {
            const code = dep.code;
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
