import { createContext, useState } from "react";

export const FilArianeContext = createContext(null);

export default function FilArianeProvider({ children }) {
  let state = useState([{ label: "Accueil", to: "/" }]);
  return <FilArianeContext.Provider value={state}>{children}</FilArianeContext.Provider>;
}
