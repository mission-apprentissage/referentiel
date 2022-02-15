import { useContext } from "react";
import { AuthContext } from "./useAuth";

export default function useAuthContext() {
  return useContext(AuthContext);
}
