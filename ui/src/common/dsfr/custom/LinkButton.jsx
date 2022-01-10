import styled from "styled-components";
import { Button } from "../elements/Button";

const LinkButton = styled(Button)`
  &&& {
    background-color: var(--background-default-grey);
    color: var(--blue-france-sun-113-625);
    padding: 0;
    background-image: none;
    min-height: unset;
    overflow: unset;
    &:hover {
      background-image: none;
    }
  }
`;

export default LinkButton;
