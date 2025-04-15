import styled from 'styled-components';
import { Table } from '../elements/Table';


const CustomTable = styled(Table)`
  &&& {
    tbody {
      td {
        font-size: 1rem;
      }

      tr {
        &:hover {
          background-color: var(--color-box-background-hover);
        }
      }
    }
  }
`;

export default CustomTable;
