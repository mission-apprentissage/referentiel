import { classNames } from "../dsfr";
import React from "react";
import useElementId from "../../hooks/useElementId";
import { Button } from "./Button";

export const modalSizeModifiers = {
  sm: "md-4",
  md: "md-8 lg-6",
  lg: "md-8",
};

export default function Modal({ title, modal, content, footer, size, modifiers, className, ...rest }) {
  const clazz = classNames("fr-col", { modifiers: modifiers || modalSizeModifiers.md, className, bemDelimiter: "-" });
  const contentId = useElementId("modal-content");

  return (
    <dialog className={"fr-modal"} id={modal.id} ref={modal.ref} aria-labelledby={contentId} role="dialog" {...rest}>
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className={clazz}>
            <div className="fr-modal__body">
              <div className="fr-modal__header">
                <Button modifiers={"close"} aria-controls={modal.id} title="Fermer" onClick={modal.close}>
                  Fermer
                </Button>
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
