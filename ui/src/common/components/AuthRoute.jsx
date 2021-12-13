import React from "react";
import { getAuth, isAnonymous, setAuth } from "../auth";
import { Navigate, Outlet } from "react-router-dom";

export const AuthContext = React.createContext(null);

export default function AuthRoute() {
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
