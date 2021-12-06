import { useFetch } from "../../common/hooks/useFetch";
import useNavigation from "../../common/hooks/useNavigation";

export function useSearch(criteria = {}) {
  let { params, buildUrl, navigate } = useNavigation();
  function search(values = {}) {
    navigate({ ...criteria, ...values });
  }

  let url = buildUrl(`/api/v1/etablissements`, { ...criteria, ...params });
  let [{ data, ...rest }] = useFetch(url, {
    etablissements: [],
    pagination: {
      page: 0,
      resultats_par_page: 0,
      nombre_de_page: 0,
      total: 0,
    },
    filtres: {},
  });

  return [{ data, params, ...rest }, search];
}
