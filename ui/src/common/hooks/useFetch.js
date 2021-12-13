import { useCallback, useEffect, useReducer } from "react";
import { _get } from "../httpClient";

export function useFetch(url, initialState = {}) {
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
      const data = await _get(url);
      dispatch({ type: "data", data });
    } catch (error) {
      dispatch({ type: "error", error });
    }
  }, [url]);

  useEffect(() => {
    async function fetchData() {
      return _fetch();
    }
    fetchData();
  }, [url, _fetch]);

  return [state, (data) => dispatch({ type: "data", data })];
}
