import React, { createContext } from "react";
import { getAuth, isAnonymous, setAuth } from "./api/auth";
import { Navigate, Outlet } from "react-router-dom";
import useNavigation from "./hooks/useNavigation";

export const AuthContext = createContext(getAuth());

export default function AuthRoutes() {
  let auth = getAuth();
  let { params } = useNavigation();

  if (params.token) {
    setAuth(params.token);
  } else if (isAnonymous()) {
    return <Navigate to={"/login"} replace={true} />;
  }

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      <Outlet />
    </AuthContext.Provider>
  );
}
