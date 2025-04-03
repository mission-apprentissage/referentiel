import { buildComponent, collapseElement } from '../dsfr';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

export const Collapse = styled(buildComponent('div', 'fr-collapse'))`
  &.fr-collapse--expanded {
    max-height: none;
  }
`;

export default function Collapsable({ id, children, modifiers, className }) {
  const ref = useRef();
  const expanded = modifiers.indexOf('expanded') !== -1;
  useEffect(() => collapseElement(ref.current), [expanded, ref]);

  return (
    <Collapse id={id} ref={ref} className={className} modifiers={modifiers}>
      {children}
    </Collapse>
  );
}
