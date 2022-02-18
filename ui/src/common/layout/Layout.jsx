import { Header } from "../dsfr/elements/Header";
import { Nav, NavLink } from "../dsfr/elements/Nav";
import { Footer, FooterLink, FooterList } from "../dsfr/elements/Footer";
import React, { useContext } from "react";
import { ApiContext } from "../ApiProvider";

export default function Layout({ children }) {
  let { isAnonymous } = useContext(ApiContext);

  return (
    <>
      <Header
        title={"Référentiel"}
        nav={
          <Nav>
            <NavLink to={"/"}>Accueil</NavLink>
            {!isAnonymous() && <NavLink to={"/tableau-de-bord"}>Tableau de bord</NavLink>}
            <NavLink to={"/organismes"}>Référentiel national</NavLink>
            <NavLink to={"/construction"}>Construction du référentiel</NavLink>
          </Nav>
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
      />
    </>
  );
}
