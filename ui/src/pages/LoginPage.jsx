import { Navigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ApiContext } from "../common/ApiProvider";

export default function Login() {
  const [searchParams] = useSearchParams();
  const { login } = useContext(ApiContext);
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      login(token);
    }
  }, [token, login]);

  return <Navigate to={token ? "/tableau-de-bord" : "/organismes"} replace={true} />;
}
