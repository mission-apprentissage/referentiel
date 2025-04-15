/**
 *
 */

import { createContext } from 'react';

import { useFetch } from './hooks';
import config from '../config';


export const DataContext = createContext({ regions: [], academies: [], departements: [] });

export default function DataProvider ({ children }) {
  const [{ data }] = useFetch(config.apiUrl + '/data', { regions: [], academies: [], departements: [] });

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
