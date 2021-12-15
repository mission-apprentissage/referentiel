import Breadcrumb, { BreadcrumbLink, BreadcrumbCurrent } from "./dsfr/elements/Breadcrumb";
import React, { useContext, useEffect, useState } from "react";
import { cloneDeep } from "lodash-es";

const FilArianeContext = React.createContext(null);

export function FilArianeProvider({ children }) {
  let state = useState([{ label: "Accueil", to: "/" }]);
  return <FilArianeContext.Provider value={state}>{children}</FilArianeContext.Provider>;
}

export function useFilAriane(list, dependencies = []) {
  let [fil, setFilAriane] = useContext(FilArianeContext);
  useEffect(() => {
    return setFilAriane(list);
  }, [setFilAriane, ...dependencies]);
  return fil;
}

export function useFilArianeContext() {
  return useContext(FilArianeContext);
}

export default function FilAriane() {
  let [fil] = useFilArianeContext();
  let array = cloneDeep(fil);
  if (array.length > 1) delete array[array.length - 1].to;

  return (
    <Breadcrumb>
      {array.map((f, index) => {
        let Component = f.to ? BreadcrumbLink : BreadcrumbCurrent;
        let options = f.to ? { to: f.to } : { "aria-current": "page" };
        return (
          <Component key={index} to={f.to} {...options}>
            {f.label}
          </Component>
        );
      })}
    </Breadcrumb>
  );
}
