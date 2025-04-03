import React from 'react';
import { ariaDescribedBy, classNames } from '../dsfr';
import Validation from '../common/Validation';
import Hint from './Hint';
import useElementId from '../../hooks/useElementId';

function Input({ label, hint, icons, validation, modifiers, className, ...rest }) {
  const id = useElementId('input');
  const clazz = classNames('fr-input-group', { modifiers, className, validation });
  const wrapperClazz = classNames('fr-input-wrap ', { icons });
  const inputClass = classNames('fr-input', { validation });
  const validationId = useElementId('validation');
  const aria = validation ? ariaDescribedBy(validationId) : {};

  return (
    <div className={clazz}>
      <label className="fr-label" htmlFor={id}>
        {label}
        {hint && <Hint>{hint}</Hint>}
      </label>
      <div className={wrapperClazz}>
        <input id={id} type="text" className={inputClass} {...aria} {...rest} />
      </div>
      {validation && <Validation id={validationId} validation={validation} />}
    </div>
  );
}

export default Input;
