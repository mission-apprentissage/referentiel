/**
 *
 */

import { ariaLabelledBy, classNames } from '../dsfr';
import Validation from '../common/Validation';
import { useElementId } from '../../hooks';


export default function Fieldset ({ legend, validation, modifiers, className, children }) {
  const clazz = classNames('fr-fieldset', { modifiers, className, validation });
  const legendId = useElementId('legend');
  const validationId = useElementId('validation');
  const aria = validation ? ariaLabelledBy(validationId, legendId) : {};

  return (
    <fieldset className={clazz} {...aria}>
      <legend id={legendId} className="fr-fieldset__legend fr-text--regular">
        {legend}
      </legend>
      <div className="fr-fieldset__content">{children}</div>
      {validation && <Validation id={validationId} validation={validation} />}
    </fieldset>
  );
}
