import React from "react";
import { getAuth, isAnonymous, setAuth } from "./auth";
import { Navigate, Outlet } from "react-router-dom";

export const AuthContext = React.createContext(getAuth());

export default function AuthProviderRoute() {
  let auth = getAuth();
  if (isAnonymous()) {
    return <Navigate to={"/login"} replace={true} />;
  }
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      <Outlet />
    </AuthContext.Provider>
  );
}
