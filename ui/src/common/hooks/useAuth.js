import { useContext } from "react";
import { AuthContext } from "../components/AuthRoute";

export function useAuth() {
  return useContext(AuthContext);
}
