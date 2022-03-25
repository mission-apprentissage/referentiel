import Fieldset from "../../common/dsfr/elements/Fieldset";
import GreyAccordionItem from "../../common/dsfr/custom/GreyAccordionItem";
import styled from "styled-components";
import { Tag } from "../../common/dsfr/elements/Tag";
import SmallCheckbox from "../../common/dsfr/custom/SmallCheckbox";
import { useContext } from "react";
import { FilterContext } from "./Filters";
import { ariaExpanded } from "../../common/dsfr/dsfr";
import { useQuery } from "../../common/hooks/useQuery";
import { Box } from "../../common/Flexbox";
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
  let param = query[paramName];
  return param ? param.split(",") : [];
}

export function Filter({ label, items, expanded = false }) {
  let { query } = useQuery();
  let { onChange: onFilterChange } = useContext(FilterContext);
  let selectedItems = items.filter((item) => {
    return getParamFromQuery(query, item.paramName).includes(item.value);
  });

  return (
    <GreyAccordionItem
      {...ariaExpanded(expanded)}
      label={<FilterTitle label={label} nbCheckedElements={selectedItems.length} />}
    >
      <Fieldset>
        {items.map((item, index) => {
          let isSelected = !!selectedItems.find((i) => isEqual(i, item));

          return (
            <SmallCheckbox
              key={index}
              name={"filter"}
              label={item.label}
              value={item.value}
              checked={isSelected}
              onChange={() => {
                let paramName = item.paramName;
                let params = getParamFromQuery(query, paramName);

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
