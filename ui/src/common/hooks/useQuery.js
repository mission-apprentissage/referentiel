import { useSearchParams } from "react-router-dom";
import { fromPairs, isEmpty, isNil, omitBy } from "lodash-es";

export function useQuery() {
  let [searchParams, setSearchParams] = useSearchParams();
  let query = fromPairs(Array.from(searchParams.entries()));

  return {
    query,
    setQuery: (values) => {
      setSearchParams(omitBy(values, (v) => isNil(v) || isEmpty(v)));
    },
  };
}
