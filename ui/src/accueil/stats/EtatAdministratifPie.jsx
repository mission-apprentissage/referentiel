/**
 *
 */

import { useFetch } from '../../common/hooks';
import Pie from '../../common/nivo/Pie';
import { getEtatAdministratifColor, getEtatAdministratifLabel } from '../../common/enums/etat_administratif';
import config from '../../config';


export default function EtatAdministratifPie () {
  const [{ data }] = useFetch(config.apiUrl + '/stats/etat_administratif', []);
  const stats = Object.keys(data).reduce((acc, key) => {
    return [
      ...acc,
      {
        id:    key,
        label: getEtatAdministratifLabel(key),
        value: data[key],
      },
    ];
  }, []);

  return (
    <Pie
      label="organismes"
      data={stats}
      getLabel={(id) => getEtatAdministratifLabel(id)}
      getColor={(id) => getEtatAdministratifColor(id)}
    />
  );
}
