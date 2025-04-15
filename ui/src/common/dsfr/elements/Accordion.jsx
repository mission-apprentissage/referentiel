/**
 *
 */

import { buildComponent } from '../dsfr';
import { Collapse } from '../common/Collapsable';
import { useCollapse } from '../common/useCollapse';


export const Accordion = buildComponent('ul', 'fr-accordions-group');

export function AccordionItem ({ label, collapsed = false, children, className, ...rest }) {
  const { collapseId, collapseRef, collapse } = useCollapse();

  return (
    <li onClick={collapse} className={className}>
      <section className="fr-accordion">
        <h3 className="fr-accordion__title">
          <button aria-expanded={collapsed} className="fr-accordion__btn" aria-controls={collapseId} {...rest}>
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
