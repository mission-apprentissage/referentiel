import { ariaLabelledBy, classNames } from "../dsfr";
import React from "react";
import Validation from "../common/Validation";
import useElementId from "../../hooks/useElementId";

export default function Fieldset({ legend, validation, modifiers, className, children }) {
  let clazz = classNames("fr-fieldset", { modifiers, className, validation });
  let legendId = useElementId("legend");
  let validationId = useElementId("validation");
  let aria = validation ? ariaLabelledBy(validationId, legendId) : {};

  return (
    <div className="fr-form-group">
      <fieldset className={clazz} {...aria}>
        <legend id={legendId} className="fr-fieldset__legend fr-text--regular">
          {legend}
        </legend>
        <div className="fr-fieldset__content">{children}</div>
        {validation && <Validation id={validationId} validation={validation} />}
      </fieldset>
    </div>
  );
}
