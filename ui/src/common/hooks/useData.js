import { useContext } from "react";
import { DataContext } from "../components/LayoutRoute";

export function useData() {
  return useContext(DataContext);
}
