import { useContext } from "react";
import { AuthContext } from "./AuthProviderRoute";

export function useAuthContext() {
  return useContext(AuthContext);
}
