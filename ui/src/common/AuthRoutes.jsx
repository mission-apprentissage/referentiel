import React, { createContext } from "react";
import { getAuth, isAnonymous, setAuth } from "./api/auth";
import { Navigate, Outlet, useSearchParams } from "react-router-dom";

export const AuthContext = createContext(getAuth());

export default function AuthRoutes() {
  let auth = getAuth();
  let [searchParams] = useSearchParams();

  if (searchParams.token) {
    setAuth(searchParams.token);
  } else if (isAnonymous()) {
    return <Navigate to={"/login"} replace={true} />;
  }

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      <Outlet />
    </AuthContext.Provider>
  );
}
