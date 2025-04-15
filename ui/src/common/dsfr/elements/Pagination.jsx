import { Link } from 'react-router-dom';
import cs from 'classnames';

import { classNames } from '../dsfr';


export function FirstPage ({ modifiers, children, className, ...rest }) {
  const clazz = classNames('fr-pagination__link', {
    modifiers,
    className: cs(className, 'fr-pagination__link--first'),
  });
  return (
    <li>
      <Link className={clazz} {...rest}>
        Première page
      </Link>
    </li>
  );
}

export function PreviousPage ({ modifiers, children, className, ...rest }) {
  const clazz = classNames('fr-pagination__link', {
    modifiers,
    className: cs(className, 'fr-pagination__link--prev', ' fr-pagination__link--lg-label'),
  });
  return (
    <li>
      <Link className={clazz} {...rest}>
        Page précédente
      </Link>
    </li>
  );
}

export function NextPage ({ modifiers, children, className, ...rest }) {
  const clazz = classNames('fr-pagination__link', {
    modifiers,
    className: cs(className, 'fr-pagination__link--next', 'fr-pagination__link--lg-label'),
  });

  return (
    <li>
      <Link className={clazz} {...rest}>
        Page suivante
      </Link>
    </li>
  );
}

export function LastPage ({ modifiers, children, className, ...rest }) {
  const clazz = classNames('fr-pagination__link', {
    modifiers,
    className: cs(className, 'fr-pagination__link--last'),
  });

  return (
    <li>
      <Link className={clazz} {...rest}>
        Dernière page
      </Link>
    </li>
  );
}

export function Page ({ modifiers, children, className, ...rest }) {
  const clazz = classNames('fr-pagination__link', {
    modifiers,
    className,
  });

  return (
    <li>
      <Link className={clazz} {...rest}>
        {children}
      </Link>
    </li>
  );
}

export function Pagination ({ children }) {
  return (
    <nav role="navigation" className="fr-pagination" aria-label="Pagination">
      <ul className="fr-pagination__list">{children}</ul>
    </nav>
  );
}
