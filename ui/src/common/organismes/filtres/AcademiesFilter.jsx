import { useContext } from "react";
import { Filter } from "./Filter.jsx";
import { DataContext } from "../../DataProvider.jsx";
import { UserContext } from "../../UserProvider.jsx";

export default function AcademiesFilter() {
  const data = useContext(DataContext);
  const [userContext] = useContext(UserContext);

  const academies = userContext.isAnonymous
    ? data.academies
    : data[`${userContext.type}s`].find((r) => r.code === userContext.code)?.academies || [];

  return (
    <Filter
      label={"Académies"}
      items={academies.map((d) => {
        return {
          label: d.nom,
          paramName: "academies",
          value: d.code,
        };
      })}
    />
  );
}
