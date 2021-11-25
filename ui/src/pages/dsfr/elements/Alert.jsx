import React from "react";
import { classNames } from "../common/utils";

export default function Alert({ title, onClose, modifiers, className, children }) {
  let clazz = classNames("fr-alert", { modifiers, className });

  return (
    <div role="alert" className={clazz}>
      {title && <p className="fr-alert__title">{title}</p>}
      {children}
      {onClose && (
        <button className="fr-link--close fr-link" title="Masquer le message" onClick={() => onClose()}>
          Masquer le message
        </button>
      )}
    </div>
  );
}
