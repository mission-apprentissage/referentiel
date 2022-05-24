import { useContext } from "react";
import { Filter } from "./Filter";
import { DataContext } from "../../common/DataProvider";
import { ApiContext } from "../../common/ApiProvider.jsx";

export default function DepartementsFilter() {
  const data = useContext(DataContext);
  const { auth, isAnonymous } = useContext(ApiContext);

  const departements = isAnonymous()
    ? data.departements
    : data[`${auth.type}s`].find((r) => r.code === auth.code)?.departements;

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
