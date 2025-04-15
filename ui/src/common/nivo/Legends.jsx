import styled from 'styled-components';
import { Box } from '../Flexbox';


const Color = styled('span')`
  font-size: 13px;
  color: #6a6a6a;
  margin-right: 1rem;
  &:before {
    vertical-align: middle;
    background: ${(props) => props.color};
    content: "";
    border-radius: 10px;
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
`;

export const Legends = styled(({ definitions, className, ...rest }) => {
  return (
    <Box className={className} {...rest}>
      {definitions.map(({ label, color }) => {
        return (
          <Color color={color} key={label}>
            {label}
          </Color>
        );
      })}
    </Box>
  );
})`
  background-color: #f9f8f6;
  padding-top: 1rem;
  padding-left: 2rem;
`;
