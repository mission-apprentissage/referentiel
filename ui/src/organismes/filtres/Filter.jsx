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

export function Filter({ label, paramName, items, expanded = false }) {
  let { query } = useQuery();
  let { onChange: onFilterChange } = useContext(FilterContext);
  let params = query[paramName] ? query[paramName].split(",") : [];

  return (
    <GreyAccordionItem
      {...ariaExpanded(expanded)}
      label={<FilterTitle label={label} nbCheckedElements={params.length} />}
    >
      <Fieldset>
        {items.map((item, index) => {
          let checked = params.includes(item.value);

          return (
            <SmallCheckbox
              key={index}
              name={"filter"}
              label={item.label}
              value={item.value}
              checked={checked}
              onChange={() => {
                let values = checked ? params.filter((p) => p !== item.value) : [...params, item.value];
                onFilterChange({ [paramName]: values });
              }}
            />
          );
        })}
      </Fieldset>
    </GreyAccordionItem>
  );
}
