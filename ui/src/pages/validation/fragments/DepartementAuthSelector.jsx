import Select from "../../../common/dsfr/elements/Select";
import { useState } from "react";
import useNavigation from "../../../common/navigation/useNavigation";
import { Box, Item } from "../../../common/Flexbox";
import { useDataContext } from "../../../common/data/useDataContext";
import { useAuthContext } from "../../../common/auth/useAuthContext";

export default function DepartementAuthSelector({ onChange }) {
  let [auth] = useAuthContext();
  let { params } = useNavigation();
  let [data] = useDataContext();
  let [selected, setSelected] = useState(params.departements || "");
  let departements = data[`${auth.type}s`].find((r) => r.code === auth.code)?.departements || [];

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
          <option value="">Tous les départements</option>
          {departements.map((dep, index) => {
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
