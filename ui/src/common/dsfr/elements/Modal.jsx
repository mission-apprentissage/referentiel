import { classNames } from "../dsfr";
import React from "react";
import useElementId from "../../hooks/useElementId";

export default function Modal({ title, modal, content, footer, modifiers, className, ...rest }) {
  let clazz = classNames("fr-modal", { modifiers, className });
  let contentId = useElementId("modal-content");

  return (
    <dialog id={modal.id} ref={modal.ref} aria-labelledby={contentId} role="dialog" className={clazz} {...rest}>
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
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
