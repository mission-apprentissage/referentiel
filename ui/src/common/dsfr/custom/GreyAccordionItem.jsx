import styled from "styled-components";
import { AccordionItem } from "../elements/Accordion";

const GreyAccordionItem = styled(AccordionItem)`
  margin-bottom: 0.5rem;

  h3 {
    background-color: var(--color-box-background);
  }

  .fr-collapse {
    margin: 0;
    background-color: rgba(249, 248, 246, 0.4);
  }
`;

export default GreyAccordionItem;
