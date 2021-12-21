import { useFetch } from "../http/useFetch";
import useNavigation from "../navigation/useNavigation";
import { isArray } from "lodash-es";

function adaptParamsForAPI(params) {
  return Object.keys(params).reduce((acc, key) => {
    let value = params[key];
    let shouldIgnoreParam = isArray(value) && value.includes("true") && value.includes("false");

    return {
      ...acc,
      ...(shouldIgnoreParam ? {} : { [key]: value }),
    };
  }, {});
}

export function useSearch(initialParams = {}) {
  let { params, buildUrl, navigate } = useNavigation();

  let url = buildUrl(`/api/v1/organismes`, { ...initialParams, ...adaptParamsForAPI(params) });
  let [state] = useFetch(url, {
    organismes: [],
    pagination: {
      page: 0,
      resultats_par_page: 0,
      nombre_de_page: 0,
      total: 0,
    },
  });

  return [
    { ...state, params },
    (values = {}) => {
      navigate({ ...initialParams, ...values });
    },
  ];
}
