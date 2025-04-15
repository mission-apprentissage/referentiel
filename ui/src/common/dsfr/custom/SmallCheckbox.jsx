import styled from 'styled-components';
import Checkbox from '../elements/Checkbox';


const SmallCheckbox = styled(Checkbox)`
  &&& {
    label {
      &:before {
        margin-top: 0.5rem;
      }
      padding: 0.5rem 0;
    }
  }
`;

export default SmallCheckbox;
