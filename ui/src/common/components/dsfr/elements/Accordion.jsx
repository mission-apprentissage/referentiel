import React from "react";
import { buildComponent } from "../common/utils";
import { Collapse } from "../common/Collapsable";
import { useCollapse } from "../common/useCollapse";

const Accordion = buildComponent("ul", "fr-accordions-group");

function AccordionItem({ label, children, ...rest }) {
  let { collapseId, collapseRef, collapse } = useCollapse();

  return (
    <li onClick={collapse} {...rest}>
      <section className="fr-accordion">
        <h3 className="fr-accordion__title">
          <button className="fr-accordion__btn" aria-controls={collapseId}>
            {label}
          </button>
        </h3>
        <Collapse id={collapseId} ref={collapseRef}>
          {children}
        </Collapse>
      </section>
    </li>
  );
}

export { Accordion, AccordionItem };
