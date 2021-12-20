import { Tag } from "../../../common/dsfr/elements/Tag";
import React from "react";
import styled from "styled-components";

const Identite = styled(({ organisme, ...props }) => {
  if (!organisme.uai) {
    return <span {...props} />;
  }

  return (
    <Tag modifiers="sm icon-left" icons={"checkbox-circle-fill"} {...props}>
      Identité validée
    </Tag>
  );
})`
  &::before {
    color: var(--text-default-success);
  }
`;

export default Identite;
