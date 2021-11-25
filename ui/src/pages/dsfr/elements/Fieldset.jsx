import { ariaLabelledBy, classNames, elementId } from "../common/utils";
import React from "react";
import Validation from "../common/Validation";

export default function Fieldset({ legend, validation, modifiers, className, children }) {
  let clazz = classNames("fr-fieldset", { modifiers, className, validation });
  let legendId = elementId("legend");
  let validationId = elementId("validation");
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
