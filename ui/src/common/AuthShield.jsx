import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { UserContext } from './UserProvider';
import Spinner from './Spinner';


export default function AuthShield () {
  const [userContext] = useContext(UserContext);

  const isAuthenticated = userContext?.token;

  if (userContext.loading) return <Spinner />;

  return isAuthenticated ? <Outlet /> : <Navigate to={'/connexion'} replace={true} />;
}
