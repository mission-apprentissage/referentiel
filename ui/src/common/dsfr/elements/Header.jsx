import { classNames } from '../dsfr';
import { Button } from './Button';
import { useModal } from '../common/useModal';
import logoONISEP from './logo_onisep.svg';


function HeaderNavbar ({ modals, showMenuButton, showSearchButton }) {
  const { menu, search } = modals;

  return (
    <div className="fr-header__navbar">
      {showSearchButton && (
        <Button modifiers={'search'} aria-controls={search.id} onClick={search.open}>
          Rechercher
        </Button>
      )}
      {showMenuButton && (
        <Button title={'Menu'} modifiers={'menu'} aria-controls={menu.id} aria-haspopup="menu" onClick={menu.open}>
          Menu
        </Button>
      )}
    </div>
  );
}

function HeaderSearch ({ modal, children, ...rest }) {
  return (
    <div id={modal.id} ref={modal.ref} className="fr-header__search fr-modal" {...rest}>
      <div className="fr-container fr-container-lg--fluid">
        <Button modifiers={'close'} aria-controls={modal.id} title="Fermer" onClick={modal.close}>
          Fermer
        </Button>
        {children}
      </div>
    </div>
  );
}

function HeaderMenu ({ modal, children, ...rest }) {
  return (
    <div id={modal.id} ref={modal.ref} className="fr-header__menu fr-modal" {...rest}>
      <div className="fr-container">
        <Button modifiers={'close'} aria-controls={modal.id} title="Fermer" onClick={modal.close}>
          Fermer
        </Button>
        <div className="fr-header__menu-links" />
        {children}
      </div>
    </div>
  );
}

export function Header ({ title, tagline, links, nav, search, modifiers, className, ...rest }) {
  const clazz = classNames('fr-header', { modifiers, className });
  const modals = {
    menu:   useModal(),
    search: useModal(),
  };

  return (
    <header role="banner" className={clazz} {...rest}>
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <p className="fr-logo">République Française</p>
                </div>
                <div className="fr-header__operator">
                  <img className="fr-responsive-img" src={logoONISEP} alt="Logo ONISEP" />
                </div>
                <HeaderNavbar modals={modals} showMenuButton={!!nav} showSearchButton={!!search} />
              </div>
              {title && (
                <div className="fr-header__service">
                  <a href="/" title={title}>
                    <p className="fr-header__service-title">{title}</p>
                  </a>
                  {tagline && <p className="fr-header__service-tagline">{tagline}</p>}
                </div>
              )}
            </div>
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">{links}</div>
              {search && <HeaderSearch modal={modals.search}>{search}</HeaderSearch>}
            </div>
          </div>
        </div>
      </div>
      {nav && <HeaderMenu modal={modals.menu}>{nav}</HeaderMenu>}
    </header>
  );
}
