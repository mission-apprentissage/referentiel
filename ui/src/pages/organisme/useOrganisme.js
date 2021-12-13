import { useFetch } from "../../common/hooks/useFetch";
import { _put } from "../../common/httpClient";

export default function useOrganisme(siret) {
  let [{ data: organisme, ...rest }, setData] = useFetch(`/api/v1/etablissements/${siret}`);
  let actions = {
    validateUAI: (uai) => {
      return _put(`/api/v1/etablissements/${siret}/validateUAI`, { uai });
    },
    setOrganisme: (organisme) => {
      setData(organisme);
    },
  };

  return [{ organisme, ...rest }, actions];
}