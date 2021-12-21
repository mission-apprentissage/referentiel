import { useFetch } from "../http/useFetch";
import { _put } from "../http/httpClient";

export default function useOrganisme(siret) {
  let [{ data: organisme, ...rest }, setData] = useFetch(`/api/v1/organismes/${siret}`);
  let actions = {
    validateUAI: (uai) => {
      return _put(`/api/v1/organismes/${siret}/validateUAI`, { uai });
    },
    setOrganisme: (organisme) => {
      setData(organisme);
    },
  };

  return [{ organisme, ...rest }, actions];
}
