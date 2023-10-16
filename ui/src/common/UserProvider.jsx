import React, { useState, useEffect, useContext } from "react";
import jwt from "jsonwebtoken";
import { ApiContext } from "./ApiProvider.jsx";

const UserContext = React.createContext([{}, () => {}]);

let initialState = { loading: true, token: null };

const UserProvider = (props) => {
  const [user, setUser] = useState(initialState);
  const { httpClient } = useContext(ApiContext);

  const verifyUser = async () => {
    const result = await httpClient._post(`/api/v1/users/refreshToken`);
    if (result.success) {
      const decodedToken = jwt.decode(result.token);
      setUser({
        code: decodedToken.code,
        email: decodedToken.email,
        nom: decodedToken.nom,
        type: decodedToken.type,
        token: result.token,
        loading: false,
        isAnonymous: false,
      });
    } else {
      setUser((oldValues) => {
        return { ...oldValues, token: null, loading: false, isAnonymous: true };
      });
    }
    setTimeout(verifyUser, 60 * 5 * 1000);
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return <UserContext.Provider value={[user, setUser]}>{props.children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
