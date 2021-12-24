import { useFetch } from "./useFetch";
import { _put } from "../api/httpClient";

export default function useOrganisme(siret) {
  let [{ data: organisme, ...rest }, setData] = useFetch(`/api/v1/organismes/${siret}`);
  let actions = {
    setUAI: (uai) => {
      return _put(`/api/v1/organismes/${siret}/setUAI`, { uai });
    },
    setOrganisme: (organisme) => {
      setData(organisme);
    },
  };

  return [{ organisme, ...rest }, actions];
}
