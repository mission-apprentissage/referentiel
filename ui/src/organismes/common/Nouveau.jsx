import React from "react";
import styled from "styled-components";
import { Box } from "../../common/Flexbox";
import Icon from "../../common/dsfr/custom/Icon";

const Nouveau = styled(({ children, ...rest }) => {
  return (
    <Box {...rest}>
      <Icon name={"info-fill"} className={"fr-mr-1w"} />
      <span className={"fr-text--bold"}>{children}</span>
    </Box>
  );
})`
  padding: 3px;
  color: #0063cb;
  background-color: #e8edff;
`;

export default Nouveau;
