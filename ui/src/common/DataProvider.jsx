import { useFetch } from "./hooks/useFetch";
import { createContext } from "react";
const config = require("../config");

export const DataContext = createContext({ regions: [], academies: [], departements: [] });

export default function DataProvider({ children }) {
  const [{ data }] = useFetch(config.apiUrl + `/data`, { regions: [], academies: [], departements: [] });

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
