/**
 *
 */

import { ariaDescribedBy, classNames } from '../dsfr';
import Validation from '../common/Validation';
import { useElementId } from '../../hooks';
import Hint from './Hint';


export default function Checkbox ({ label, hint, validation, modifiers, className, ...rest }) {
  const id = useElementId('checkbox');
  const validationId = useElementId('validation');
  const aria = validation ? ariaDescribedBy(validationId) : {};
  const clazz = classNames('fr-checkbox-group', {
    modifiers,
    className,
    validation,
  });

  return (
    <div className={clazz} {...aria}>
      <input type="checkbox" id={id} {...rest} />
      <label className="fr-label" htmlFor={id}>
        {label}
        {hint && <Hint>{hint}</Hint>}
      </label>
      {validation && <Validation id={validationId} validation={validation} />}
    </div>
  );
}
