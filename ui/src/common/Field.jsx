import styled from 'styled-components';
import cs from 'classnames';
import NA from './organismes/NA';
import { isEmpty } from 'lodash-es';
import { Box } from './Flexbox';
import Tooltip from './Tooltip';

const Field = styled(({ label, value, tooltip, children, className, ...rest }) => {
  return (
    <Box align={'baseline'} className={cs(className, 'fr-pb-6v')} {...rest}>
      {label && <span className={'fr-text--regular'}>{label} :&nbsp;</span>}
      {!isEmpty(value) ? <span className={'fr-text fr-text--bold fr-p-1v value'}>{value}</span> : <NA />}
      {children}
      {tooltip && <Tooltip label={label} description={tooltip} />}
    </Box>
  );
})`
  .value {
    background-color: var(--background-alt-beige-gris-galet);
  }
`;

export default Field;
