/**
 *
 */

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Header } from '../dsfr/elements/Header';
import { Link } from '../dsfr/elements/Link';
import { Nav, NavLink } from '../dsfr/elements/Nav';
import { Footer, FooterLink, FooterList } from '../dsfr/elements/Footer';
import { UserContext } from '../UserProvider';
import { ApiContext } from '../ApiProvider';


export function Layout ({ children }) {
  const [userContext, setUserContext] = useContext(UserContext);
  const { httpClient } = useContext(ApiContext);
  const navigate = useNavigate();
  console.log({ userContext });
  const handleLogout = async (e) => {
    e.preventDefault();

    if (userContext.email) {
      await httpClient._get('/api/v1/users/logout');
    }
    setUserContext({ token: null, loading: false, isAnonymous: true });
    window.scrollTo(0, 0);
    navigate('/');
  };

  return (
    <>
      <Header
        title={'Référentiel UAI-SIRET des OFA-CFA'}
        nav={
          <Nav>
            <NavLink to={'/'}>Accueil</NavLink>
            {!userContext.isAnonymous && <NavLink to={'/tableau-de-bord'}>Tableau de bord</NavLink>}
            {userContext.isAdmin && <NavLink to={'/suivi-modifications'}>Tableau de suivi des modifications</NavLink>}
            <NavLink to={'/organismes'}>Référentiel national</NavLink>
            <NavLink to={'/construction'}>Construction du Référentiel</NavLink>
            <NavLink to={'/corrections'}>Correction et fiabilisation des données</NavLink>
            <NavLink to={'/stats'}>Statistiques</NavLink>
          </Nav>
        }
        links={
          <ul className="fr-btns-group">
            {userContext.isAnonymous ? (
              <li>
                <Link to="/connexion" icons="lock-line" modifiers="icon-left">
                  Espace de fiabilisation - Académies
                </Link>
              </li>
            ) : (
              <li>
                <Link to="#" onClick={handleLogout} icons="logout-box-r-line" modifiers="icon-left">
                  Se déconnecter
                </Link>
              </li>
            )}
          </ul>
        }
      />

      <div style={{ marginBottom: '15rem' }}>{children}</div>

      <Footer
        content={{
          desc: (
                  <>
                    Mandaté par le ministère du Travail, l'Onisep assure, avec un réseau d'experts des services
                    statistiques
                    académiques, le maintien de ce Référentiel d'organismes de formation dans le but de fiabiliser la
                    circulation des offres de formation en apprentissage vers les outils d'affectation et d'inscription
                    en
                    formation initiale du secondaire (Téléservices Affelnet) et du supérieur (Parcoursup) via le{' '}
                    <a href="https://catalogue-apprentissage.intercariforef.org/" target="_blank" rel="noreferrer">
                      Catalogue des formations en apprentissage
                    </a>{' '}
                    du réseau des Carif-Oref.
                  </>
                ),
          list: (
                  <FooterList>
                    <FooterLink as={'a'} href="https://www.legifrance.gouv.fr/" target={'_blank'}>
                      legifrance.gouv.fr
                    </FooterLink>
                    <FooterLink as={'a'} href="https://www.gouvernement.fr/" target={'_blank'}>
                      gouvernement.fr
                    </FooterLink>
                    <FooterLink as={'a'} href="https://www.service-public.fr" target={'_blank'}>
                      service-public.fr
                    </FooterLink>
                    <FooterLink as={'a'} href="https://www.data.gouv.fr/fr/" target={'_blank'}>
                      data.gouv.fr
                    </FooterLink>
                    <FooterLink as={'a'} href="https://onisep.fr" target={'_blank'}>
                      Onisep.fr
                    </FooterLink>
                    <FooterLink as={'a'} href="https://opendata.onisep.fr/" target={'_blank'}>
                      Opendata Onisep.fr
                    </FooterLink>
                  </FooterList>
                ),
        }}
        bottom={{
          list: (
                  <FooterList>
                    <FooterLink to={'/modifications'} onClick={() => window.scrollTo(0, 0)}>
                      Journal des modifications
                    </FooterLink>
                    <FooterLink to={'/mentions-legales'} onClick={() => window.scrollTo(0, 0)}>
                      Mentions légales
                    </FooterLink>
                    <FooterLink to={'/donnees-personnelles'} onClick={() => window.scrollTo(0, 0)}>
                      Données personnelles
                    </FooterLink>
                    <FooterLink to={'/contact'} onClick={() => window.scrollTo(0, 0)}>
                      Contact
                    </FooterLink>
                  </FooterList>
                ),
        }}
      />
    </>
  );
}
