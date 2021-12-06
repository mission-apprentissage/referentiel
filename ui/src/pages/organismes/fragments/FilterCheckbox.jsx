import { Field, useFormikContext } from "formik";
import Checkbox from "../../../common/components/dsfr/elements/Checkbox";

export default function FilterCheckbox({ filterName, item, ...props }) {
  let { submitForm, handleChange, values } = useFormikContext();
  let triggerSubmit = (e) => {
    handleChange(e);
    submitForm();
  };

  return (
    <Field
      as={Checkbox}
      onChange={triggerSubmit}
      name={filterName}
      label={item.label}
      value={item.code}
      hint={item.nombre_de_resultats}
      checked={values[filterName].includes(item.code)}
      {...props}
    />
  );
}
