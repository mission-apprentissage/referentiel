import { useContext } from "react";
import { DataContext } from "../../common/hooks/useData";
import { Filter } from "./Filter";

export default function DepartementsFilter() {
  let [{ departements }] = useContext(DataContext);

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
