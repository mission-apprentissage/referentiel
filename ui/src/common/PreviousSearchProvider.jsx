import React, { createContext, useEffect, useState } from "react";
import { useLocation, useMatch } from "react-router-dom";

export const SearchContext = createContext(null);

export default function PreviousSearchProvider({ children }) {
  let location = useLocation();
  let isValidation = !!useMatch("/tableau-de-bord/validation/:type");
  let isOrganismes = !!useMatch("/organismes");
  let [previous, setPrevious] = useState("/organismes");

  useEffect(() => {
    if (isValidation || isOrganismes) {
      setPrevious(`${location.pathname}${location.search}`);
    }
  }, [location, isValidation, isOrganismes]);

  return <SearchContext.Provider value={previous}>{children}</SearchContext.Provider>;
}
