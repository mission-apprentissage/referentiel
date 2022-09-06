import Fieldset from "../../dsfr/elements/Fieldset.jsx";
import GreyAccordionItem from "../../dsfr/custom/GreyAccordionItem.jsx";
import styled from "styled-components";
import { Tag } from "../../dsfr/elements/Tag.jsx";
import SmallCheckbox from "../../dsfr/custom/SmallCheckbox.jsx";
import { useContext } from "react";
import { FilterContext } from "./Filters.jsx";
import { ariaExpanded } from "../../dsfr/dsfr.js";
import { useQuery } from "../../hooks/useQuery.js";
import { Box } from "../../Flexbox.jsx";
import { isEqual } from "lodash-es";

const FilterTitle = styled(({ label, nbCheckedElements, ...rest }) => {
  return (
    <Box align={"baseline"} {...rest}>
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

function getParamFromQuery(query, paramName) {
  const param = query[paramName];
  return param ? param.split(",") : [];
}

export function Filter({ label, items, expanded = false }) {
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
              name={"filter"}
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
