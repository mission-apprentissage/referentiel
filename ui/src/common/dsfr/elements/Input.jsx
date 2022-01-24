import React from "react";
import { ariaDescribedBy, classNames, elementId } from "../dsfr";
import Validation from "../common/Validation";
import Hint from "./Hint";

function Input({ label, hint, icons, validation, modifiers, className, ...rest }) {
  let id = elementId("input");
  let clazz = classNames("fr-input-group", { modifiers, className, validation });
  let wrapperClazz = classNames("fr-input-wrap ", { icons });
  let inputClass = classNames("fr-input", { validation });
  let validationId = elementId("validation");
  let aria = validation ? ariaDescribedBy(validationId) : {};

  return (
    <div className={clazz}>
      <label className="fr-label" htmlFor={id}>
        {label}
        {hint && <Hint>{hint}</Hint>}
      </label>
      <div className={wrapperClazz}>
        <input id={id} type="text" className={inputClass} {...aria} {...rest} />
      </div>
      {validation && <Validation id={validationId} validation={validation} />}
    </div>
  );
}

export default Input;
