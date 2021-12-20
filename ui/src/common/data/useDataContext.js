import { useContext } from "react";
import { DataContext } from "./DataProvider";

export function useDataContext() {
  return useContext(DataContext);
}
