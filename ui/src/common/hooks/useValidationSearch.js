import { useSearch } from "./useSearch";
import { UserContext } from "../UserProvider";
import { useContext } from "react";
import { getValidationParams } from "../enums/validation";

export function useValidationSearch(type, custom = {}) {
  const [userContext] = useContext(UserContext);

  return useSearch({
    [`${userContext.type}s`]: userContext.code,
    ...getValidationParams(type),
    ...custom,
  });
}
