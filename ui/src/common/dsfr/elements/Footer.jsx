import { Children, cloneElement } from 'react';
import { classNames } from '../dsfr';
import { Link } from 'react-router-dom';
import { cloneNodes } from '../../utils';

export function FooterList({ position, children, ...rest }) {
  return (
    <ul className={`fr-footer__${position}-list`} {...rest}>
      {Children.toArray(children).map((child, index) => {
        return (
          <li key={index} className={`fr-footer__${position}-item`}>
            {cloneElement(child, { position })}
          </li>
        );
      })}
    </ul>
  );
}

export function FooterLink({ as = Link, position, modifiers, children, className, ...rest }) {
  const Component = as;
  const clazz = classNames(`fr-footer__${position}-link`, { modifiers, className });

  return (
    <Component className={clazz} {...rest}>
      {children}
    </Component>
  );
}

export function Footer({ top, content, bottom }) {
  return (
    <footer className="fr-footer" role="contentinfo" id="footer">
      {top && (
        <div className="fr-footer__top">
          <div className="fr-container">
            <div className="fr-grid-row fr-grid-row--start fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-sm-3 fr-col-md-2">
                <h3 className="fr-footer__top-cat">{top.cat}</h3>
                {cloneNodes(top.list, () => ({ position: 'top' }))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="fr-container">
        <div className="fr-footer__body">
          <div className="fr-footer__brand fr-enlarge-link">
            <a href="/" title="Retour à l’accueil">
              <p className="fr-logo" title="République Française">
                République Française
              </p>
            </a>
          </div>
          {content && (
            <div className="fr-footer__content">
              {content.desc && <p className="fr-footer__content-desc">{content.desc}</p>}
              {cloneNodes(content.list, () => ({ position: 'content' }))}
            </div>
          )}
        </div>
        {bottom && (
          <div className="fr-footer__bottom">
            {cloneNodes(bottom.list, () => ({ position: 'bottom' }))}
            {bottom.copyright && <div className="fr-footer__bottom-copy">{bottom.copyright}</div>}
          </div>
        )}
      </div>
    </footer>
  );
}
