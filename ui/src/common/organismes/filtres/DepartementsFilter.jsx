/**
 *
 */

import { useContext } from 'react';

import { Filter } from './Filter';
import { DataContext } from '../../DataProvider';
import { UserContext } from '../../UserProvider';


export function DepartementsFilter () {

  const data = useContext(DataContext);
  const [userContext] = useContext(UserContext);

  const departements =
    userContext.isAnonymous || userContext.isAdmin
      ? data?.departements
      : data[`${userContext.type}s`]?.find((r) => r.code === userContext.code)?.departements || [];

  return <Filter
    label={'Départements'}
    items={departements.map((d) => {
      return {
        label:     d.nom,
        paramName: 'departements',
        value:     d.code,
      };
    })}
  />;
}
