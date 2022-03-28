import { useContext } from "react";
import { ApiContext } from "../ApiProvider";
import { useQuery } from "./useQuery";

export default function useExport() {
  let { buildLink } = useContext(ApiContext);
  let { query } = useQuery();

  return buildLink(`/api/v1/organismes.csv`, { ...query, page: 0, items_par_page: 100000 });
}
