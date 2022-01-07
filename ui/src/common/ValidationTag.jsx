import React from "react";
import styled from "styled-components";
import { Tag } from "./dsfr/elements/Tag";

const iconMapper = {
  A_VALIDER: "error-warning-fill",
  A_RENSEIGNER: "error-warning-fill",
  VALIDE: "checkbox-circle-fill",
};

const ValidationTag = styled(({ type, label, ...props }) => {
  return (
    <Tag modifiers={`sm icon-left ${type}`} icons={iconMapper[type]} {...props}>
      {label}
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
