import Select from "../../common/dsfr/elements/Select";
import { useContext, useState } from "react";
import { Box, Item } from "../../common/Flexbox";
import { DataContext } from "../../common/DataProvider";
import { ApiContext } from "../../common/ApiProvider";

export default function DepartementAuthSelector({ departement, onChange }) {
  const data = useContext(DataContext);
  const { auth } = useContext(ApiContext);
  const [selected, setSelected] = useState(departement || "");
  const departements = data[`${auth.type}s`].find((r) => r.code === auth.code)?.departements || [];

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
          <option value="">Tous les départements</option>
          {departements.map((dep, index) => {
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
