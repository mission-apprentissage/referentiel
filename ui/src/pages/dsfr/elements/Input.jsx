import React from "react";
import { ariaDescribedBy, classNames, elementId } from "../common/utils";
import Validation from "../common/Validation";
import Hint from "./Hint";

function Input({ label, hint, icon = "", validation, modifiers, className, ...rest }) {
  let id = elementId("input");
  let clazz = classNames("fr-input-group", { modifiers, className, validation });
  let inputClass = classNames("fr-input", { validation });
  let validationId = elementId("validation");
  let aria = validation ? ariaDescribedBy(validationId) : {};

  return (
    <div className={clazz}>
      <label className="fr-label" htmlFor={id}>
        {label}
        {hint && <Hint>{hint}</Hint>}
      </label>
      <div className={`fr-input-wrap ${icon}`}>
        <input id={id} type="text" className={inputClass} {...aria} {...rest} />
      </div>
      {validation && <Validation id={validationId} validation={validation} />}
    </div>
  );
}

export default Input;
