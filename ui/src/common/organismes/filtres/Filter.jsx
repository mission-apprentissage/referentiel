/**
 *
 */

import { useContext } from 'react';
import { isEqual } from 'lodash-es';
import styled from 'styled-components';

import Fieldset from '../../dsfr/elements/Fieldset';
import GreyAccordionItem from '../../dsfr/custom/GreyAccordionItem';
import { Tag } from '../../dsfr/elements/Tag';
import SmallCheckbox from '../../dsfr/custom/SmallCheckbox';
import { FilterContext } from './Filters';
import { ariaExpanded } from '../../dsfr/dsfr';
import { useQuery } from '../../hooks/useQuery';
import { Box } from '../../Flexbox';


const FilterTitle = styled(({ label, nbCheckedElements, ...rest }) => {
  return (
    <Box align={'baseline'} {...rest}>
      {label}
      {nbCheckedElements > 0 && <Tag>{nbCheckedElements}</Tag>}
    </Box>
  );
})`
  .fr-tag {
    margin-left: 0.5rem;
    color: var(--text-inverted-grey);
    background-color: var(--text-action-high-blue-france);
  }
`;

function getParamFromQuery (query, paramName) {
  const param = query[paramName];
  return param ? param.split(',') : [];
}

export function Filter ({ label, items, expanded = false }) {
  const { query } = useQuery();
  const { onChange: onFilterChange, register } = useContext(FilterContext);
  items.forEach((item) => register(item.paramName));
  const selectedItems = items.filter((item) => {
    return getParamFromQuery(query, item.paramName).includes(item.value);
  });

  return (
    <GreyAccordionItem
      {...ariaExpanded(expanded)}
      label={<FilterTitle label={label} nbCheckedElements={selectedItems.length} />}
    >
      <Fieldset>
        {items.map((item, index) => {
          const isSelected = !!selectedItems.find((i) => isEqual(i, item));

          return (
            <SmallCheckbox
              key={index}
              name={'filter'}
              label={item.label}
              value={item.value}
              checked={isSelected}
              onChange={() => {
                const paramName = item.paramName;
                const params = getParamFromQuery(query, paramName);

                let changes;
                if (isSelected) {
                  changes = params.filter((v) => v !== item.value);
                } else {
                  changes = [...params, item.value];
                }

                onFilterChange({
                  [paramName]: changes,
                });
              }}
            />
          );
        })}
      </Fieldset>
    </GreyAccordionItem>
  );
}
