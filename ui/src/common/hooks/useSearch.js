import { useFetch } from "./useFetch";
import useNavigation from "./useNavigation";
import { omitBy } from "lodash-es";

export function useSearch(initialParams = {}) {
  let { params, buildUrl, navigate } = useNavigation();
  let p = omitBy(params, (v) => v === "true,false" || v === "false,true");
  let url = buildUrl(`/api/v1/etablissements`, { ...initialParams, ...p });
  let [state] = useFetch(url, {
    etablissements: [],
    pagination: {
      page: 0,
      resultats_par_page: 0,
      nombre_de_page: 0,
      total: 0,
    },
    filtres: {},
  });

  return [
    { ...state, params },
    (values = {}) => {
      navigate({ ...initialParams, ...values });
    },
  ];
}
