import { asFormValidation, validators } from "../../../../common/formikUtils";
import { Field } from "formik";
import Radio from "../../../../common/components/dsfr/elements/Radio";
import Input from "../../../../common/components/dsfr/elements/Input";
import React from "react";

export function RadioWithInput({ ...props }) {
  function validateInput(value) {
    //TODO add async call to check if uai is valid
    return !value
      ? null
      : validators.uai
          .validate(value)
          .then(() => null)
          .catch((e) => {
            return e.errors.join(" ,");
          });
  }

  return (
    <div>
      <Field as={Radio} label={"Autre"} value={"custom"} {...props} />
      {props.checked && (
        <Field name="custom" validate={validateInput}>
          {({ field, form }) => {
            let { touched, errors } = form;
            return <Input {...field} className={"fr-ml-2w"} validation={asFormValidation(touched, errors, "custom")} />;
          }}
        </Field>
      )}
    </div>
  );
}
