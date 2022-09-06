import Radio from "../../../../common/dsfr/elements/Radio.jsx";
import Input from "../../../../common/dsfr/elements/Input.jsx";
import React from "react";
import useFormContext from "../../../../common/form/useFormContext.js";
import Fieldset from "../../../../common/dsfr/elements/Fieldset.jsx";
import { sortBy } from "lodash-es";

export function UAIPotentielsRadios({ organisme, action }) {
  const { registerField, values, errors } = useFormContext();
  const potentiels = sortBy(organisme.uai_potentiels, (p) => {
    return p.uai === organisme._meta.uai_probable ? "_first" : p.uai;
  }).reverse();

  return (
    <Fieldset legend={action.legend}>
      {potentiels.map(({ uai, sources }, index) => {
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
