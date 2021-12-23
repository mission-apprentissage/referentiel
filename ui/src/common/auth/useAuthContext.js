import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

export function useAuthContext() {
  return useContext(AuthContext);
}
