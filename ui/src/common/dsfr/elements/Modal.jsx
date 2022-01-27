import { classNames } from "../dsfr";
import React from "react";
import useElementId from "../../hooks/useElementId";

export const modalSizeModifiers = {
  sm: "md-4",
  md: "md-8 lg-6",
  lg: "md-8",
};

export default function Modal({ title, modal, content, footer, size, modifiers, className, ...rest }) {
  let clazz = classNames("fr-col", { modifiers: modifiers || modalSizeModifiers.md, className, bemDelimiter: "-" });
  let contentId = useElementId("modal-content");

  return (
    <dialog className={"fr-modal"} id={modal.id} ref={modal.ref} aria-labelledby={contentId} role="dialog" {...rest}>
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className={clazz}>
            <div className="fr-modal__body">
              <div className="fr-modal__header">
                <button
                  className="fr-link--close fr-link"
                  title="Fermer la fenêtre modale"
                  aria-controls={modal.id}
                  onClick={modal.close}
                  type={"button"}
                >
                  Fermer
                </button>
              </div>
              <div className="fr-modal__content" id={contentId}>
                {content}
              </div>
              <div className="fr-modal__footer">{footer}</div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
