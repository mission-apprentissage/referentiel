import { createContext } from "react";
import { useFetch } from "../http/useFetch";

export const DataContext = createContext(null);

export default function DataProvider({ children }) {
  let [{ data }, setData] = useFetch(`/api/v1/data`, { regions: [], academies: [], departements: [] });

  return <DataContext.Provider value={[data, setData]}>{children}</DataContext.Provider>;
}
