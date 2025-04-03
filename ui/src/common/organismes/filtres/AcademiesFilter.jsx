import { useContext } from 'react';
import { Filter } from './Filter';
import { DataContext } from '../../DataProvider';
import { UserContext } from '../../UserProvider';

export default function AcademiesFilter() {
  const data = useContext(DataContext);
  const [userContext] = useContext(UserContext);

  const academies =
    userContext.isAnonymous || userContext.isAdmin
      ? data.academies
      : data[`${userContext.type}s`].find((r) => r.code === userContext.code)?.academies || [];

  return (
    <Filter
      label={'Académies'}
      items={academies.map((d) => {
        return {
          label: d.nom,
          paramName: 'academies',
          value: d.code,
        };
      })}
    />
  );
}
