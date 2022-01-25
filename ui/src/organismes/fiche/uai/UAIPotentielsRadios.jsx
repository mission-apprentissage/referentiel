import Radio from "../../../common/dsfr/elements/Radio";
import Input from "../../../common/dsfr/elements/Input";
import React from "react";
import useFormContext from "../../../common/form/useFormContext";
import Fieldset from "../../../common/dsfr/elements/Fieldset";
import { sortBy } from "lodash-es";

export function UAIPotentielsRadios({ organisme, action }) {
  let { registerField, values, errors } = useFormContext();
  let potentiels = sortBy(organisme.uai_potentiels, (p) => {
    return p.uai === organisme._meta.uai_probale ? "_first" : p.uai;
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
