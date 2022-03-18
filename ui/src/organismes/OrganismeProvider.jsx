import { createContext } from "react";

export const OrganismeContext = createContext(null);

export default function OrganismeProvider({ organisme, onChange, children }) {
  let context = { organisme, onChange };
  return <OrganismeContext.Provider value={context}>{children}</OrganismeContext.Provider>;
}
