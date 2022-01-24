import React from "react";
import { ariaDescribedBy, classNames } from "../dsfr";
import Validation from "../common/Validation";
import Hint from "./Hint";
import useElementId from "../../hooks/useElementId";

export default function Checkbox({ label, hint, validation, modifiers, className, ...rest }) {
  let id = useElementId("checkbox");
  let validationId = useElementId("validation");
  let aria = validation ? ariaDescribedBy(validationId) : {};
  let clazz = classNames("fr-checkbox-group", {
    modifiers,
    className,
    validation,
  });

  return (
    <div className={clazz} {...aria}>
      <input type="checkbox" id={id} {...rest} />
      <label className="fr-label" htmlFor={id}>
        {label}
        {hint && <Hint>{hint}</Hint>}
      </label>
      {validation && <Validation id={validationId} validation={validation} />}
    </div>
  );
}
