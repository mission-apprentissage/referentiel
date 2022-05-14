import { useSearch } from "./useSearch";
import { ApiContext } from "../ApiProvider";
import { useContext } from "react";
import { getValidationParams } from "../enums/validation";

export function useValidationSearch(type, custom = {}) {
  const { auth } = useContext(ApiContext);

  return useSearch({
    [`${auth.type}s`]: auth.code,
    ...getValidationParams(type),
    ...custom,
  });
}
