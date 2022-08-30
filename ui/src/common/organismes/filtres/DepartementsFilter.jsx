import { useContext } from "react";
import { Filter } from "./Filter.jsx";
import { DataContext } from "../../DataProvider.jsx";
import { ApiContext } from "../../ApiProvider.jsx";

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
