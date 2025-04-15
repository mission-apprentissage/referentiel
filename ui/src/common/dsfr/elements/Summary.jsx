import { Children, cloneElement } from 'react';
import { classNames } from '../dsfr';
import cs from 'classnames';


export function Summary ({ title = 'Sommaire', children, modifiers, className, ...rest }) {

  const clazz = classNames('fr-summary', { modifiers, className });

  return (
    <nav className={clazz} role="navigation" aria-labelledby="fr-summary-title" {...rest}>
      <p className="fr-summary__title" id="fr-summary-title">
        {title}
      </p>
      <ol className="fr-summary__list">
        {Children.toArray(children).map((child, index) => {
          return (
            <li key={index}>{cloneElement(child, { className: cs('fr-summary__link', child.props.className) })}</li>
          );
        })}
      </ol>
    </nav>
  );
}
