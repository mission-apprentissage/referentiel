import React, { useState, useEffect, useCallback, useContext } from 'react';
import jwt from 'jsonwebtoken';
import { ApiContext } from './ApiProvider.jsx';

const UserContext = React.createContext([{}, () => {}]);

const anonymous = { sub: 'anonymous', isAnonymous: true, loading: true };

const UserProvider = (props) => {
  const { httpClient } = useContext(ApiContext);
  const [user, setUser] = useState(anonymous);

  const verifyUser = useCallback(async () => {
    const tokenFromStorage = sessionStorage.getItem('referentiel:token');

    const result = await httpClient._post('/api/v1/users/refreshToken');

    if (result.success || tokenFromStorage) {
      const token = result.token || tokenFromStorage;
      const decodedToken = jwt.decode(token);

      setUser({
        code: decodedToken.code,
        email: decodedToken.email,
        nom: decodedToken.nom,
        type: decodedToken.type,
        token: token,
        loading: false,
        isAnonymous: false,
        isAdmin: decodedToken.isAdmin,
      });
    } else {
      setUser((oldValues) => {
        return { ...oldValues, token: null, loading: false, isAnonymous: true };
      });
    }
    setTimeout(verifyUser, 60 * 5 * 1000);
  }, [setUser]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  return <UserContext.Provider value={[user, setUser]}>{props.children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
