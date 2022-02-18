import { useFetch } from "./hooks/useFetch";
import { createContext } from "react";

export const DataContext = createContext({ regions: [], academies: [], departements: [] });

export default function DataProvider({ children }) {
  let [{ data }] = useFetch(`/api/v1/data`, { regions: [], academies: [], departements: [] });

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
