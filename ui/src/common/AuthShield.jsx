import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthContext from "./hooks/useAuthContext";

export default function AuthShield() {
  let { isAnonymous } = useAuthContext();

  return isAnonymous() ? <Navigate to={"/login"} replace={true} /> : <Outlet />;
}
