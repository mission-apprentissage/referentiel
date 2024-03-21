import { Navigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import jwt from "jsonwebtoken";
import { UserContext } from "./common/UserProvider.jsx";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [_, setUserContext] = useContext(UserContext);

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      const decodedToken = jwt.decode(token);
      setUserContext({
        code: decodedToken.code,
        email: decodedToken.email,
        nom: decodedToken.nom,
        type: decodedToken.type,
        token: token,
        loading: false,
        isAnonymous: false,
      });
      sessionStorage.setItem("referentiel:token", token);
    }
  }, [token]);

  return <Navigate to={token ? "/tableau-de-bord" : "/organismes"} replace={true} />;
}
