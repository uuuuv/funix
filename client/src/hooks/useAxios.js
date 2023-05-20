import { useState, useEffect, useRef, useCallback } from "react";
import axios from "../services/axios";

// inject i18n
let i18n;
export const i18nInjector = (injectedObj) => {
  i18n = injectedObj;
};

const defaultDataHadnler = (data) => {
  return data;
};

function useAxios(dataHandler = defaultDataHadnler) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const abortController = useRef();

  const sendRequest = useCallback(async (config) => {
    try {
      setIsLoading(true);
      setError(null);
      if (abortController.current) {
        abortController.current.abort();
      }

      abortController.current = new AbortController();
      const response = await axios({
        ...config,
        signal: abortController.current.signal,
      });

      setData(dataHandler(response.data));
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        setIsLoading(false);
        return;
      }

      setError({
        httpCode: error.httpCode,
        message: error.message,
        code: error.code,
      });
    }
  });

  const resetStates = (type) => {
    if (type === "error") {
      setError(null);
    }
    if (type === "loading") {
      setIsLoading(false);
    }

    if (type === "data") {
      setData(null);
    }

    if (!type) {
      setError(null);
      setIsLoading(false);
      setData(null);

      if (abortController.current) {
        abortController.current.abort();
        abortController.current = null;
      }
    }
  };

  useEffect(() => {
    if (error || data) {
      setIsLoading(false);
    }
  }, [error, data]);

  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return [sendRequest, isLoading, data, error, resetStates];
}

export default useAxios;
