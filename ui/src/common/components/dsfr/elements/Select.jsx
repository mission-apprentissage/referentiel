import React from "react";
import { ariaDescribedBy, classNames, elementId } from "../common/utils";
import Validation from "../common/Validation";
import Hint from "./Hint";

function Input({ label, hint, validation, children, modifiers, className, ...rest }) {
  let id = elementId("input");
  let clazz = classNames("fr-select-group", { modifiers, className, validation });
  let selectClass = classNames("fr-select", { validation });
  let validationId = elementId("validation");
  let aria = validation ? ariaDescribedBy(validationId) : {};

  return (
    <div className={clazz}>
      {label && (
        <label className="fr-label" htmlFor={id}>
          {label}
          {hint && <Hint>{hint}</Hint>}
        </label>
      )}
      <select id={id} className={selectClass} {...aria} {...rest}>
        {children}
      </select>
      {validation && <Validation id={validationId} validation={validation} />}
    </div>
  );
}

export default Input;
