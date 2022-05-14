import Input from "../../../../common/dsfr/elements/Input";
import React from "react";
import useFormContext from "../../../../common/form/useFormContext";

export function UAICustom({ action }) {
  const { registerField, errors } = useFormContext();

  return (
    <>
      <div>{action.legend}</div>
      <Input {...registerField("custom")} className={"fr-ml-2w"} validation={errors?.custom} />
    </>
  );
}
