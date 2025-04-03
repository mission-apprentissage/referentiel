import { Filter } from './Filter.jsx';
import Tooltip from '../../Tooltip.jsx';
import { Box } from '../../Flexbox.jsx';
import React from 'react';

export default function DatagouvFilter() {
  return (
    <Filter
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
    />
  );
}
