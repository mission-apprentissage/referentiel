import Radio from "../../../../common/components/dsfr/elements/Radio";
import Input from "../../../../common/components/dsfr/elements/Input";
import React from "react";
import useFormContext from "../../../../common/hooks/useFormContext";

export function CustomUAIInput() {
  let { registerField, values, errors } = useFormContext();

  return (
    <div>
      <Radio {...registerField("uai")} label={"Autre"} value={"custom"} />
      {values.uai === "custom" && (
        <Input {...registerField("custom")} className={"fr-ml-2w"} validation={errors?.custom} />
      )}
    </div>
  );
}
