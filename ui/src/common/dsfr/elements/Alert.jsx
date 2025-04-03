import React from 'react';
import { classNames } from '../dsfr';
import { Button } from './Button';

export default function Alert({ title, onClose, modifiers, className, children }) {
  const clazz = classNames('fr-alert', { modifiers, className });

  return (
    <div className={clazz}>
      {title && <p className="fr-alert__title">{title}</p>}
      {children}
      {onClose && (
        <Button modifiers={'close'} title="Masquer le message" onClick={() => onClose()}>
          Masquer le message
        </Button>
      )}
    </div>
  );
}
