import { useElementId } from '../../hooks';


export const modalSizeModifiers = {
  sm: 'md-4',
  md: 'md-8 lg-6',
  lg: 'md-8',
};

export default function Modal ({ title, modal, content, footer, size, modifiers, className, closeModal, ...rest }) {
  const contentId = useElementId('modal-content');

  return (
    <dialog className={'fr-modal'} id={modal.id} ref={modal.ref} aria-labelledby={contentId} {...rest}>
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div className="fr-modal__body">
              <div className="fr-modal__header">
                <p
                  className="fr-link--close fr-link"
                  aria-controls="fr-modal-2"
                  onClick={closeModal}
                  style={{ cursor: 'pointer' }}
                >
                  Fermer
                </p>
              </div>
              <div className="fr-modal__content">
                <p>{content}</p>
              </div>
              <div className="fr-modal__footer">{footer}</div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
