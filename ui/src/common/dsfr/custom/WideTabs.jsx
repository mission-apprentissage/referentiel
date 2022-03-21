import styled from "styled-components";
import { Tabs } from "../elements/Tabs";

const WideTabs = styled(Tabs)`
  &&& {
    margin-left: 0;
    margin-right: 0;
    
    &:after {
      box-shadow: 0 0 0 1px var(--border-default-grey);
    }

    .fr-table td, .fr-table th {
      vertical-align: top;
    }
    
    .fr-tabs__panel {
      padding: 2rem 0;

    }
`;

export default WideTabs;
