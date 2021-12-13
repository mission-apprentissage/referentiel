import { Field, useFormikContext } from "formik";
import { SmallCheckbox } from "../../../common/components/dsfr/elements/Checkbox";

export default function FilterCheckbox({ filterName, item, ...props }) {
  let { submitForm, handleChange, values } = useFormikContext();
  let triggerSubmit = (e) => {
    handleChange(e);
    submitForm();
  };

  return (
    <Field
      as={SmallCheckbox}
      onChange={triggerSubmit}
      name={filterName}
      label={item.label}
      value={item.code}
      checked={values[filterName].includes(item.code)}
      {...props}
    />
  );
}
