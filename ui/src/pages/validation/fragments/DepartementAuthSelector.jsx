import Select from "../../../common/components/dsfr/elements/Select";
import { useContext, useState } from "react";
import useNavigation from "../../../common/hooks/useNavigation";
import { Box, Item } from "../../../common/components/Flexbox";
import { DataContext } from "../../../common/components/LayoutRoute";
import { AuthContext } from "../../../common/components/AuthRoute";

export default function DepartementAuthSelector({ onChange }) {
  let { params } = useNavigation();
  let [auth] = useContext(AuthContext);
  let { regions } = useContext(DataContext);
  let [selected, setSelected] = useState(params.departements || "");
  let departements = regions.find((r) => r.code === auth.code)?.departements || [];

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
