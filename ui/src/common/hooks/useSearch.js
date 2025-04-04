/**
 *
 */

import { useFetch } from './useFetch';
import { buildUrl } from '../utils';
import { useQuery } from './useQuery';
import { useContext, useEffect, useMemo } from 'react';
import { SearchContext } from '../SearchProvider';
import { useLocation } from 'react-router-dom';
import { usePrevious } from './usePrevious';
import { isEqual, isString } from 'lodash-es';


const config = require('../../config');

function adaptParamsForAPI (params) {
  return Object.keys(params).reduce((acc, key) => {
    const value = params[key];
    const shouldIgnoreParam =
      isString(value) && value.includes(',') && value.includes('true') && value.includes('false');

    return {
      ...acc,
      ...(shouldIgnoreParam ? {} : { [key]: value }),
    };
  }, {});
}

export function useSearch (defaults, options = {}, token = null) {
  const { query, setQuery } = useQuery();
  const location = useLocation();
  const { setSearch } = useContext(SearchContext);
  const search = useMemo(() => {
    return { page: location.pathname, params: { ...defaults, ...query } };
  }, [location.pathname, defaults, query]);
  const previous = usePrevious(search);

  useEffect(() => {
    if (!options.silent && !isEqual(previous, search)) {
      setSearch(search);
    }
  }, [options.silent, previous, search, setSearch]);

  const path = options?.path ? options.path : '/organismes';
  const url = buildUrl(config.apiUrl + path, adaptParamsForAPI(search.params));
  const entity = options?.entity ? options.entity : 'organismes';
  const [response] = useFetch(
    url,
    {
      [entity]:   [],
      pagination: {
        page:               0,
        resultats_par_page: 0,
        nombre_de_page:     0,
        total:              0,
      },
    },
    token,
  );

  return {
    response,
    search: (params = {}) => setQuery({ ...params }),
    refine: (params = {}) => setQuery({ ...query, ...params }),
    params: search.params,
  };
}
