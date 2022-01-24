import React from "react";
import { classNames } from "../dsfr";
import Hint from "./Hint";
import useElementId from "../../hooks/useElementId";

export default function Radio({ label, hint, modifiers, className, ...rest }) {
  let id = useElementId("radio");
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
