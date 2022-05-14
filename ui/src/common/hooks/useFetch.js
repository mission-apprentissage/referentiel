import { useCallback, useContext, useEffect, useReducer } from "react";
import { ApiContext } from "../ApiProvider";

export function useFetch(url, initialState = {}) {
  const { httpClient } = useContext(ApiContext);

  function fetchReducer(state, action) {
    switch (action.type) {
      case "error":
        return { loading: false, data: state.data, error: action.error };
      case "loading":
        return { loading: true, data: state.data, error: null };
      case "data":
        return { loading: false, data: action.data, error: null };
      default:
        throw new Error(`Unhandled action type ${action.type}`);
    }
  }

  const [state, dispatch] = useReducer(fetchReducer, {
    data: initialState,
    loading: true,
    error: null,
  });

  const _fetch = useCallback(async () => {
    try {
      console.info(`Requesting ${url}`);
      dispatch({ type: "loading" });
      const data = await httpClient._get(url);
      dispatch({ type: "data", data });
    } catch (error) {
      console.error(error);
      dispatch({ type: "error", error });
    }
  }, [httpClient, url]);

  useEffect(() => {
    async function fetchData() {
      return _fetch();
    }
    fetchData();
  }, [url, _fetch]);

  return [state, (data) => dispatch({ type: "data", data })];
}
