import { useFetch } from "./useFetch";
import { buildUrl } from "../utils";
import { useQuery } from "./useQuery";

function adaptQueryForAPI(params) {
  return Object.keys(params).reduce((acc, key) => {
    let value = params[key];
    let shouldIgnoreParam = value.indexOf(",") !== -1 && value.includes("true") && value.includes("false");

    return {
      ...acc,
      ...(shouldIgnoreParam ? {} : { [key]: value }),
    };
  }, {});
}

export function useSearch(defaults = {}) {
  let { query, setQuery } = useQuery();

  let url = buildUrl(`/api/v1/organismes`, { ...defaults, ...adaptQueryForAPI(query) });
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
  };
}
