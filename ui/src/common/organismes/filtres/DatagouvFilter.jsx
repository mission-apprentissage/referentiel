/**
 *
 */

import { Filter } from './Filter';
import Tooltip from '../../Tooltip';
import { Box } from '../../Flexbox';

export function DatagouvFilter () {

  return <Filter
    label={
      <Box align={'end'}>
        <span>Liste publique des organismes de formation</span>
        <Tooltip
          label={'Liste publique des organismes de formation'}
          description={
            'Liste les organismes déclarés auprès du Préfet de Région territorialement compétent et à jour de leur obligation de transmission du Bilan Pédagogique et Financier.'
          }
        />
      </Box>
    }
    items={[
      { label: 'Présent', paramName: 'referentiels', value: 'datagouv' },
      { label: 'Non présent', paramName: 'referentiels', value: '-datagouv' },
    ]}
  />;
}
