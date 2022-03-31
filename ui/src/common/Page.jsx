import React, { useEffect } from "react";

export default function Page({ children }) {
  useEffect(() => window.scrollTo(0, 0));

  return <>{children}</>;
}
