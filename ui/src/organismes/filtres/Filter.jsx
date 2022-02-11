import Fieldset from "../../common/dsfr/elements/Fieldset";
import GreyAccordionItem from "../../common/dsfr/custom/GreyAccordionItem";
import styled from "styled-components";
import { Tag } from "../../common/dsfr/elements/Tag";
import SmallCheckbox from "../../common/dsfr/custom/SmallCheckbox";
import { useContext } from "react";
import { FilterContext } from "./Filters";
import { ariaExpanded } from "../../common/dsfr/dsfr";
import { useQuery } from "../../common/hooks/useQuery";

const FilterTitle = styled(({ label, nbCheckedElements, ...rest }) => {
  return (
    <div {...rest}>
      <span>{label}</span>
      {nbCheckedElements > 0 && <Tag>{nbCheckedElements}</Tag>}
    </div>
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
  let { onChange, register } = useContext(FilterContext);
  let array = query[paramName] ? query[paramName].split(",") : [];
  register(paramName);

  return (
    <GreyAccordionItem
      {...ariaExpanded(expanded)}
      label={<FilterTitle label={label} nbCheckedElements={array.length} />}
    >
      <Fieldset>
        {items.map((item, index) => {
          let checked = array.includes(item.code);
          return (
            <SmallCheckbox
              key={index}
              name={paramName}
              label={item.label}
              value={item.code}
              checked={checked}
              onChange={() => {
                let elements = checked ? array.filter((i) => i !== item.code) : [...array, item.code];
                onChange({ [paramName]: elements });
              }}
            />
          );
        })}
      </Fieldset>
    </GreyAccordionItem>
  );
}
