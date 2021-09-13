import { useState, useCallback, useEffect } from "react";
import { _get, _put } from "../httpClient";

export function useGet(url, initalState = {}) {
  const [response, setResponse] = useState(initalState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await _get(url);
      setResponse(response);
      setLoading(false);
    } catch (error) {
      setError(error.json);
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    async function run() {
      return sendRequest();
    }
    run();
  }, [url, sendRequest]);

  return [response, loading, error];
}

export function usePut(url, body) {
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await _put(url, body || {});
      setResponse(response);
      setLoading(false);
    } catch (error) {
      setError(error.json);
      setLoading(false);
    }
  }, [body, url]);

  useEffect(() => {
    async function run() {
      return sendRequest();
    }
    run();
  }, [url, sendRequest]);

  return [response, loading, error];
}
