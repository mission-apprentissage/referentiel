import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../dsfr/elements/Header";
import { Link } from "../dsfr/elements/Link";
import { Nav, NavLink } from "../dsfr/elements/Nav";
import { Footer, FooterLink, FooterList } from "../dsfr/elements/Footer";
import { UserContext } from "../UserProvider";
import { ApiContext } from "../ApiProvider";

export default function Layout({ children }) {
  const [userContext, setUserContext] = useContext(UserContext);
  const { httpClient } = useContext(ApiContext);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    if (userContext.email) {
      await httpClient._get(`/api/v1/users/logout`);
    }
    setUserContext({ token: null, loading: false, isAnonymous: true });
    window.scrollTo(0, 0);
    navigate("/");
  };

  return (
    <>
      <Header
        title={"Référentiel UAI-SIRET des OFA-CFA"}
        nav={
          <Nav>
            <NavLink to={"/"}>Accueil</NavLink>
            {!userContext.isAnonymous && <NavLink to={"/tableau-de-bord"}>Tableau de bord</NavLink>}
            {userContext.isAdmin && <NavLink to={"/suivi-modifications"}>Tableau de suivi des modifications</NavLink>}
            <NavLink to={"/organismes"}>Référentiel national</NavLink>
            <NavLink to={"/construction"}>Construction du référentiel</NavLink>
            <NavLink to={"/corrections"}>Correction et fiabilisation des données</NavLink>
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

      <div style={{ marginBottom: "15rem" }}>{children}</div>

      <Footer
        content={{
          desc: (
            <>
              Mandatée par les ministres en charge de l’éducation nationale, de l’enseignement supérieur, du travail et
              de la transformation publique, la{" "}
              <a href="https://beta.gouv.fr/startups/?incubateur=mission-apprentissage">Mission interministérielle</a>{" "}
              pour l'apprentissage développe plusieurs services destinés à faciliter les entrées en apprentissage. Le
              référentiel SIRET-UAI facilite l’identification des organismes de formation en apprentissage.
            </>
          ),
          list: (
            <FooterList>
              <FooterLink as={"a"} href="https://www.legifrance.gouv.fr/" target={"_blank"}>
                legifrance.gouv.fr
              </FooterLink>
              <FooterLink as={"a"} href="https://www.gouvernement.fr/" target={"_blank"}>
                gouvernement.fr
              </FooterLink>
              <FooterLink as={"a"} href="https://www.service-public.fr" target={"_blank"}>
                service-public.fr
              </FooterLink>
              <FooterLink as={"a"} href="https://www.data.gouv.fr/fr/" target={"_blank"}>
                data.gouv.fr
              </FooterLink>
            </FooterList>
          ),
        }}
        bottom={{
          list: (
            <FooterList>
              <FooterLink to={"/stats"} onClick={() => window.scrollTo(0, 0)}>
                Statistiques
              </FooterLink>
              {userContext.isAnonymous ? (
                <FooterLink to={"/connexion"} onClick={() => window.scrollTo(0, 0)}>
                  Se connecter
                </FooterLink>
              ) : (
                <FooterLink to={"#"} onClick={handleLogout}>
                  Se déconnecter
                </FooterLink>
              )}
            </FooterList>
          ),
        }}
      />
    </>
  );
}
