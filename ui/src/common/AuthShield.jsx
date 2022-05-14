import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ApiContext } from "./ApiProvider";

export default function AuthShield() {
  const { isAnonymous } = useContext(ApiContext);

  return isAnonymous() ? <Navigate to={"/login"} replace={true} /> : <Outlet />;
}
