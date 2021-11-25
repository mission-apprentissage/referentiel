import { buildComponent, collapseElement } from "./utils";
import { useEffect, useRef } from "react";
import styled from "styled-components";

export const Collapse = styled(buildComponent("div", "fr-collapse"))`
  &.fr-collapse--expanded {
    max-height: none;
  }
`;

export default function Collapsable({ id, children, modifiers, className }) {
  let ref = useRef();
  let expanded = modifiers.indexOf("expanded") !== -1;
  useEffect(() => collapseElement(ref.current), [expanded, ref]);

  return (
    <Collapse id={id} ref={ref} className={className} modifiers={modifiers}>
      {children}
    </Collapse>
  );
}
