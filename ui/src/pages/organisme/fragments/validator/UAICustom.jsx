import Input from "../../../../common/dsfr/elements/Input";
import React from "react";
import useFormContext from "../../../../common/form/useFormContext";

export function UAICustom({ organisme, validation }) {
  let { registerField, errors } = useFormContext();

  return (
    <>
      <div>{validation.legend}</div>
      <Input {...registerField("custom")} className={"fr-ml-2w"} validation={errors?.custom} />
    </>
  );
}
