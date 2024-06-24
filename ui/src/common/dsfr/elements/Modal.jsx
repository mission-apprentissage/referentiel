import React from "react";
import useElementId from "../../hooks/useElementId";

export const modalSizeModifiers = {
  sm: "md-4",
  md: "md-8 lg-6",
  lg: "md-8",
};

export default function Modal({ title, modal, content, footer, size, modifiers, className, closeModal, ...rest }) {
  const contentId = useElementId("modal-content");

  return (
    <dialog className={"fr-modal"} id={modal.id} ref={modal.ref} aria-labelledby={contentId} {...rest}>
      <div class="fr-container fr-container--fluid fr-container-md">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div class="fr-modal__body">
              <div class="fr-modal__header">
                <p
                  class="fr-link--close fr-link"
                  aria-controls="fr-modal-2"
                  onClick={closeModal}
                  style={{ cursor: "pointer" }}
                >
                  Fermer
                </p>
              </div>
              <div class="fr-modal__content">
                <p>{content}</p>
              </div>
              <div class="fr-modal__footer">{footer}</div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
