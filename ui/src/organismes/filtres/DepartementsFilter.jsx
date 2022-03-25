import { useContext } from "react";
import { Filter } from "./Filter";
import { DataContext } from "../../common/DataProvider";

export default function DepartementsFilter() {
  let { departements } = useContext(DataContext);

  return (
    <Filter
      label={"Départements"}
      items={departements.map((d) => {
        return {
          label: d.nom,
          paramName: "departements",
          value: d.code,
        };
      })}
    />
  );
}
