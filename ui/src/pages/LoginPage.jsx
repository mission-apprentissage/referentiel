import { Navigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ApiContext } from "../common/ApiProvider";

export default function Login() {
  let [searchParams] = useSearchParams();
  let { login } = useContext(ApiContext);
  let token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      login(token);
    }
  }, [token, login]);

  return <Navigate to={token ? "/tableau-de-bord" : "/organismes"} replace={true} />;
}
