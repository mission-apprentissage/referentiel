import styled from "styled-components";
import cs from "classnames";
import NA from "../organismes/common/NA";
import React from "react";
import { isEmpty } from "lodash-es";

const Field = styled(({ label, value, children, className, ...rest }) => {
  return (
    <div className={cs(className, "fr-pb-6v")} {...rest}>
      {label && <span className={"fr-text--regular"}>{label} :&nbsp;</span>}
      {!isEmpty(value) ? <span className={"fr-text fr-text--bold fr-p-1v value"}>{value}</span> : <NA />}
      {children}
    </div>
  );
})`
  .value {
    background-color: var(--background-alt-beige-gris-galet);
  }
`;

export default Field;
