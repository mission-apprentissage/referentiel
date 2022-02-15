import { useFetch } from "./useFetch";
import { createContext } from "react";

export const DataContext = createContext(null);

export default function useData() {
  let [{ data }] = useFetch(`/api/v1/data`, { regions: [], academies: [], departements: [] });

  return data;
}
