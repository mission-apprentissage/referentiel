import { useFetch } from "./useFetch";
import { buildUrl } from "../utils";
import { useQuery } from "./useQuery";
import { useContext, useEffect, useMemo } from "react";
import { SearchContext } from "../SearchProvider";
import { useLocation } from "react-router-dom";
import usePrevious from "./usePrevious";
import { isEqual } from "lodash-es";

function adaptParamsForAPI(params) {
  return Object.keys(params).reduce((acc, key) => {
    let value = params[key];
    let shouldIgnoreParam =
      value instanceof String && value.indexOf(",") !== -1 && value.includes("true") && value.includes("false");

    return {
      ...acc,
      ...(shouldIgnoreParam ? {} : { [key]: value }),
    };
  }, {});
}

export function useSearch(defaults = {}) {
  let { query, setQuery } = useQuery();
  let location = useLocation();
  let { setSearch } = useContext(SearchContext);
  let search = useMemo(() => {
    return { page: location.pathname, params: { ...defaults, ...query } };
  }, [location.pathname, defaults, query]);
  let previous = usePrevious(search);

  useEffect(() => {
    if (!isEqual(previous, search)) {
      setSearch(search);
    }
  }, [previous, search, setSearch]);

  let url = buildUrl(`/api/v1/organismes`, adaptParamsForAPI(search.params));
  let [response] = useFetch(url, {
    organismes: [],
    pagination: {
      page: 0,
      resultats_par_page: 0,
      nombre_de_page: 0,
      total: 0,
    },
  });

  return {
    response,
    search: (params = {}) => setQuery({ ...params }),
    refine: (params = {}) => setQuery({ ...query, ...params }),
    params: search.params,
  };
}
