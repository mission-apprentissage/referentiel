import styled from "styled-components";
import { Tag } from "../../../../common/dsfr/elements/Tag";
import React from "react";

const ValidationTag = styled(({ validation, ...props }) => {
  return (
    <Tag modifiers={`sm icon-left ${validation.type}`} icons={validation.icon} {...props}>
      {validation.label}
    </Tag>
  );
})`
  &.fr-tag--A_VALIDER {
    &.fr-fi-error-warning-fill::before {
      color: var(--yellow-moutarde-main-679);
    }
  }

  &.fr-tag--INCONNUE {
    &.fr-fi-error-warning-fill::before {
      color: var(--pink-tuile-main-556);
    }
  }

  &.fr-tag--VALIDEE {
    &.fr-fi-checkbox-circle-fill::before {
      color: var(--text-default-success);
    }
  }
`;

export default ValidationTag;
