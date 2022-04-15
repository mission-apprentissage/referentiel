import styled from "styled-components";
import { Button } from "../elements/Button";

const FullModal = styled(({ modal, children, ...rest }) => {
  return (
    <div {...rest}>
      <div id={modal.id} ref={modal.ref} className={"fr-modal"}>
        <div className="fr-container fr-container-lg--fluid">
          <Button modifiers={"close"} aria-controls={modal.id} title="Fermer" onClick={modal.close}>
            Fermer
          </Button>
          {children}
        </div>
      </div>
    </div>
  );
})`
  --link-underline: none;
  --link-blank-font: none;
  --link-blank-content: none;
  --ul-type: none;
  --ol-type: none;
  --ul-start: 0;
  --ol-start: 0;
  --xl-block: 0;
  --li-bottom: 0;
  --ol-content: none;
  --text-spacing: 0;
  --title-spacing: 0;
  width: 100%;
  box-shadow: 0 8px 8px 0 rgb(0 0 0 / 10%), 0 8px 16px -16px rgb(0 0 0 / 32%);
  position: relative;
  --blend: var(--background-elevated-grey-blend);
  background-color: var(--background-elevated-grey);

  .fr-modal {
    overflow: auto;
    justify-content: initial;
    --blend: var(--background-elevated-grey-blend);
    background-color: var(--background-elevated-grey);
  }

  .fr-modal > .fr-container {
    pointer-events: all;
    padding-top: 1rem;
    padding-bottom: 4.5rem;
    height: 100%;
  }

  .fr-modal > * > .fr-btn--close {
    margin-bottom: 1.5rem;
  }
`;

export default FullModal;
