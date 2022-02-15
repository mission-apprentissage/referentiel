import { Navigate, useSearchParams } from "react-router-dom";
import useAuthContext from "../common/hooks/useAuthContext";
import { useEffect } from "react";

export default function Login() {
  let [searchParams] = useSearchParams();
  let { login } = useAuthContext();
  let token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      login(token);
    }
  }, [token, login]);

  return <Navigate to={token ? "/tableau-de-bord" : "/organismes"} replace={true} />;
}
