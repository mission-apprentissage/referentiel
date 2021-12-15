import { useFetch } from "./useFetch";
import useNavigation from "./useNavigation";

export function useSearch(initialParams = {}) {
  let { params, buildUrl, navigate } = useNavigation();
  let url = buildUrl(`/api/v1/etablissements`, { ...initialParams, ...params });
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
