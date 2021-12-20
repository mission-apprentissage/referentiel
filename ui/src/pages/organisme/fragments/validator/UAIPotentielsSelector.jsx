import Radio from "../../../../common/dsfr/elements/Radio";
import Input from "../../../../common/dsfr/elements/Input";
import React from "react";
import useFormContext from "../../../../common/form/useFormContext";
import Fieldset from "../../../../common/dsfr/elements/Fieldset";

export function UAIPotentielsSelector({ organisme, validation }) {
  let { registerField, values, errors } = useFormContext();

  return (
    <Fieldset legend={validation.legend}>
      {organisme.uai_potentiels.map(({ uai, sources }, index) => {
        return (
          <Radio
            {...registerField("uai")}
            key={index}
            label={uai}
            value={uai}
            hint={`Sources: ${sources.join(" ,")}`}
          />
        );
      })}
      <div>
        <Radio {...registerField("uai")} label={"Autre"} value={"custom"} />
        {values.uai === "custom" && (
          <Input {...registerField("custom")} className={"fr-ml-2w"} validation={errors?.custom} />
        )}
      </div>
    </Fieldset>
  );
}
