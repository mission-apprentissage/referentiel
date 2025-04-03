import React from 'react';
import styled from 'styled-components';
import cs from 'classnames';

const NA = styled(({ className }) => {
  return <span className={cs('fr-text', 'fr-text--bold', 'fr-p-1v', 'value', className)}>N.D</span>;
})`
  color: var(--text-disabled-grey);
`;

export default NA;
