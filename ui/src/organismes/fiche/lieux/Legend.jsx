import styled from 'styled-components';
import { Box } from '../../../common/Flexbox.jsx';

const Legend = styled(({ children, className }) => {
  return (
    <Box align={'center'}>
      <div className={className} />
      {children}
    </Box>
  );
})`
  height: 1rem;
  width: 1rem;
  margin-right: 0.5rem;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  display: inline-block;
`;

export default Legend;
