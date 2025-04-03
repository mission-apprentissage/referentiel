/**
 *
 */

import { useContext } from 'react';

import { useSearch } from './useSearch';
import { UserContext } from '../UserProvider';
import { getValidationParams } from '../enums/validation';


export function useValidationSearch (type, custom = {}) {

  const [userContext] = useContext(UserContext);

  return useSearch({
    ...(!userContext.isAdmin ? { [`${userContext.type}s`]: userContext.code } : {}),
    ...getValidationParams(type),
    ...custom,
  });
}
