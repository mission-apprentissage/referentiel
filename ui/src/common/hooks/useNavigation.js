import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";

function buildUrl(base, data) {
  let params = `${queryString.stringify(data, { skipNull: true, skipEmptyString: true })}`;
  return `${base}?${params}`;
}

export default function useNavigation() {
  let navigate = useNavigate();
  let location = useLocation();
  let params = queryString.parse(window.location.search);

  return {
    params,
    buildUrl,
    navigate: (data) => {
      let url = buildUrl(location.pathname, data);
      return navigate(url);
    },
  };
}
