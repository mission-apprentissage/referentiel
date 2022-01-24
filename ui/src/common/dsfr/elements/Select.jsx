import React from "react";
import { ariaDescribedBy, classNames } from "../dsfr";
import Validation from "../common/Validation";
import Hint from "./Hint";
import useElementId from "../../hooks/useElementId";

function Input({ label, hint, validation, children, modifiers, className, ...rest }) {
  let id = useElementId("input");
  let clazz = classNames("fr-select-group", { modifiers, className, validation });
  let selectClass = classNames("fr-select", { validation });
  let validationId = useElementId("validation");
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
