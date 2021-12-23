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
      color: var(--color-validation-icon-A_VALIDER);
    }
  }

  &.fr-tag--A_RENSEIGNER {
    &.fr-fi-error-warning-fill::before {
      color: var(--color-validation-icon-A_RENSEIGNER);
    }
  }

  &.fr-tag--VALIDE {
    &.fr-fi-checkbox-circle-fill::before {
      color: var(--color-validation-icon-VALIDE);
    }
  }
`;

export default ValidationTag;
