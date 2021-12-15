import { Header } from "./dsfr/elements/Header";
import { Nav, NavLink } from "./dsfr/elements/Nav";
import { Container, GridRow } from "./dsfr/fondamentaux";
import { Footer, FooterLink, FooterList } from "./dsfr/elements/Footer";
import React from "react";
import Ariane from "./Ariane";
import { Outlet } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import useScrollToTop from "../hooks/useScrollToTop";

export const DataContext = React.createContext(null);

export default function LayoutRoute() {
  let [{ data }, setData] = useFetch(`/api/v1/data`, { regions: [], academies: [], departements: [] });
  useScrollToTop();
  return (
    <DataContext.Provider value={[data, setData]}>
      <div>
        <Header
          title={"Référentiel"}
          tagline={"Le pourfendeur d'UAI"}
          nav={
            <Nav>
              <NavLink to={"/"}>Tableau de bord</NavLink>
              <NavLink to={"/organismes"}>Liste des organismes</NavLink>
            </Nav>
          }
        />
        <Container>
          <GridRow>
            <Ariane />
          </GridRow>
        </Container>
        <Outlet />
        <Footer
          content={{
            desc: <span>Lorem [...] elit ut.</span>,
            list: (
              <FooterList>
                <FooterLink to={"/"}>Lien 1</FooterLink>
                <FooterLink to={"/"}>Lien 2</FooterLink>
              </FooterList>
            ),
          }}
          bottom={{
            list: (
              <FooterList>
                <FooterLink to={"/"}>Lien 1</FooterLink>
                <FooterLink to={"/"}>Lien 2</FooterLink>
              </FooterList>
            ),
            copyright: (
              <p>
                Sauf mention contraire, tous les contenus de ce site sont sous
                <a href="https://github.com/etalab/licence-ouverte/blob/master/LO.md" target="_blank" rel="noreferrer">
                  licence etalab-2.0
                </a>
              </p>
            ),
          }}
        />
      </div>
    </DataContext.Provider>
  );
}
