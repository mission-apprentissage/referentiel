import React from 'react';
import { buildListComponent, classNames } from '../dsfr';
import Hint from './Hint';
import useElementId from '../../hooks/useElementId';

export const ToggleList = buildListComponent('ul', 'fr-toggle__list');

export function ToggleSwitch({ label, hint, modifiers, className, ...rest }) {
  const id = useElementId('toggle');
  const hintId = useElementId('hint');
  const clazz = classNames('fr-toggle', { modifiers, className });

  return (
    <div className={clazz}>
      <input id={id} type="checkbox" className="fr-toggle__input" aria-describedby={hintId} {...rest} />
      <label
        className="fr-toggle__label"
        data-fr-checked-label="Activé"
        data-fr-unchecked-label="Désactivé"
        htmlFor={id}
      >
        {label}
      </label>
      {hint && <Hint id={hintId}>{hint}</Hint>}
    </div>
  );
}
