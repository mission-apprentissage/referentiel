import { useFormikContext } from "formik";
import Fieldset from "../../../common/components/dsfr/elements/Fieldset";
import FilterTitle from "./FilterTitle";
import FilterCheckbox from "./FilterCheckbox";
import GreyAccordionItem from "../../../common/components/dsfr/custom/GreyAccordionItem";

export default function Filter({ label, filterName, filter, ...rest }) {
  const { values } = useFormikContext();
  let nbCheckedElements = values[filterName].length;

  return (
    <GreyAccordionItem label={<FilterTitle label={label} nbCheckedElements={nbCheckedElements} {...rest} />}>
      <Fieldset>
        {filter.map((item, index) => {
          return <FilterCheckbox key={index} filterName={filterName} item={item} />;
        })}
      </Fieldset>
    </GreyAccordionItem>
  );
}
