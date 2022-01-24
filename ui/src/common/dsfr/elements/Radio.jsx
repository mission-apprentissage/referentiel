import React from "react";
import { classNames, elementId } from "../dsfr";
import Hint from "./Hint";

export default function Radio({ label, hint, modifiers, className, ...rest }) {
  let id = elementId("radio");
  let clazz = classNames("fr-radio-group", { modifiers, className });

  return (
    <div className={clazz}>
      <input type="radio" id={id} {...rest} />
      <label className="fr-label" htmlFor={id}>
        {label}
        {hint && <Hint>{hint}</Hint>}
      </label>
    </div>
  );
}
