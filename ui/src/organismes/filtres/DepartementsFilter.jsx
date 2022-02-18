import { useContext } from "react";
import { Filter } from "./Filter";
import { DataContext } from "../../common/DataProvider";

export default function DepartementsFilter() {
  let { departements } = useContext(DataContext);

  return (
    <Filter
      label={"Départements"}
      paramName={"departements"}
      items={departements.map((d) => {
        return {
          code: d.code,
          label: d.nom,
        };
      })}
    />
  );
}
