import queryString from "query-string";
import buildQuery from "../utils/buildQuery";
import { useFetch } from "./useFetch";
import { omit } from "lodash-es";
import { useLocation, useNavigate } from "react-router-dom";

export function useSearch(custom = {}) {
  let history = useNavigate();
  let location = useLocation();

  let defaults = {
    ordre: "desc",
    page: 1,
    items_par_page: 25,
    ...custom,
    ...queryString.parse(window.location.search),
  };

  function search(options = {}) {
    let keys = Object.keys(options);
    history.push(`${location.pathname}?${buildQuery({ ...omit(defaults, keys), ...options })}`);
  }

  let url = `/api/v1/etablissements?${buildQuery(defaults)}`;
  console.info(`Requesting ${url}`);
  let [data, loading, error] = useFetch(url, {
    etablissements: [],
    pagination: {
      page: 0,
      resultats_par_page: 0,
      nombre_de_page: 0,
      total: 0,
    },
  });

  return [{ data, loading, error }, search];
}
