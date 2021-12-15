import styled from "styled-components";
import { AccordionItem } from "../elements/Accordion";

const GreyAccordionItem = styled(AccordionItem)`
  margin-bottom: 0.5rem;
  h3 {
    background-color: var(--background-box);
  }

  .fr-collapse {
    background-color: var(--background-box-light);
  }
`;

export default GreyAccordionItem;
