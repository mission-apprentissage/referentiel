import { useFormikContext } from "formik";
import styled from "styled-components";
import { AccordionItem as FilterItem } from "../../../common/components/dsfr/elements/Accordion";
import Fieldset from "../../../common/components/dsfr/elements/Fieldset";
import FilterTitle from "./FilterTitle";
import FilterCheckbox from "./FilterCheckbox";

const Filter = styled(({ label, filterName, filter, ...props }) => {
  const { values } = useFormikContext();
  let nbCheckedElements = values[filterName].length;

  return (
    <FilterItem {...props} label={<FilterTitle label={label} nbCheckedElements={nbCheckedElements} />}>
      <Fieldset>
        {filter.map((item, index) => {
          return <FilterCheckbox key={index} filterName={filterName} item={item} />;
        })}
      </Fieldset>
    </FilterItem>
  );
})`
  margin-bottom: 0.5rem;
  .fr-accordion {
    background-color: #f9f8f6;
  }

  .fr-tag {
    margin-left: 0.5rem;
    color: var(--text-inverted-grey);
    background-color: var(--text-action-high-blue-france);
  }
`;

export default Filter;
