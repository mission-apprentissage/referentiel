import { Filter } from './Filter.jsx';
import Tooltip from '../../Tooltip.jsx';
import { Box } from '../../Flexbox.jsx';

export default function UAIFilter() {
  return (
    <Filter
      label={
        <Box>
          <span>UAI</span>
          <Tooltip
            label={'UAI'}
            description={
              'Une UAI est validée dès lors qu’elle a fait l’objet d’une fiabilisation par un référent en académie ou par un administrateur du site.'
            }
          />
        </Box>
      }
      items={[
        { label: 'Validée', paramName: 'uais', value: 'true' },
        { label: 'Non validée', paramName: 'uais', value: 'false' },
      ]}
    />
  );
}
