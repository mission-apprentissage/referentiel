import React, { useState } from "react";
import { Accordion, AccordionItem } from "./dsfr/elements/Accordion";
import SearchBar from "./dsfr/elements/SearchBar";
import Alert from "./dsfr/elements/Alert";
import { Button, ButtonGroup } from "./dsfr/elements/Button";
import { Col, Container, GridRow } from "./dsfr/fondamentaux";
import styled from "styled-components";
import { icon } from "./dsfr/common/utils";
import Radio from "./dsfr/elements/Radio";
import Checkbox from "./dsfr/elements/Checkbox";
import Fieldset from "./dsfr/elements/Fieldset";
import { Footer, FooterLink, FooterList } from "./dsfr/elements/Footer";
import Input from "./dsfr/elements/Input";
import Select from "./dsfr/elements/Select";
import { ToggleList, ToggleSwitch } from "./dsfr/elements/ToggleSwitch";
import { Tab, TabPanel, Tabs } from "./dsfr/elements/Tabs";
import { Header, HeaderMenu, HeaderSearch } from "./dsfr/elements/Header";
import { Link, LinkGroup } from "./dsfr/elements/Link";
import { Nav, NavButton, NavLink } from "./dsfr/elements/Nav";

const Colored = styled.div`
  background-color: ${(props) => props.color};
`;

function Composant({ children }) {
  return <GridRow className={"fr-pt-3w"}>{children}</GridRow>;
}

function Element({ children }) {
  return <div className={"fr-pt-2w"}>{children}</div>;
}

function Option({ children }) {
  return <div className={"fr-pt-1w"}>{children}</div>;
}

export default function DesignPage() {
  let [showAlert, setShowAlert] = useState(true);

  return (
    <div>
      <Header
        title={"Nom du service"}
        tagline={"Précisions sur l‘organisation"}
        links={
          <LinkGroup>
            <Link to="/" className="fr-fi-add-circle-line">
              Créer un espace
            </Link>
            <Link to="/" className="fr-fi-lock-line">
              Se connecter
            </Link>
            <Link to="/" className="fr-fi-account-line">
              S’enregistrer
            </Link>
          </LinkGroup>
        }
        nav={
          <Nav>
            <NavButton text={"Menu"} aria-current={"page"}>
              <NavLink to="/">SubNavLink 1</NavLink>
              <NavLink to="/">SubNavLink 2</NavLink>
            </NavButton>
            <NavLink to="/">NavLink 1</NavLink>
            <NavLink to="/">NavLink 2</NavLink>
          </Nav>
        }
        search={<SearchBar label={"Recherche"} />}
      />
      <Container>
        <Composant>
          <Col>
            <h2>Fondamentaux</h2>
            <Element>
              <h3>Grille</h3>
              <Option>
                <h4>Défaut</h4>
                <Container>
                  <GridRow modifiers={"left gutters"}>
                    <Col modifiers={"2"}>
                      <Colored color={"red"}>2</Colored>
                    </Col>
                    <Col modifiers={"6"}>
                      <Colored color={"green"}>6</Colored>
                    </Col>
                    <Col modifiers={"sm-2 md-3 lg-4"}>
                      <Colored color={"blue"}>sm: 2, md: 3, lg: 4</Colored>
                    </Col>
                  </GridRow>
                </Container>
              </Option>
              <Option>
                <h4>Fluide</h4>
                <Container modifiers={"fluid"}>
                  <GridRow>
                    <Col>
                      <Colored color={"red"}>12</Colored>
                    </Col>
                    <Col>
                      <Colored color={"red"}>12</Colored>
                    </Col>
                  </GridRow>
                </Container>
              </Option>
            </Element>
          </Col>
        </Composant>
        <Composant>
          <Col>
            <h2>Éléments d'interface</h2>
            <Element>
              <h3>Tabs</h3>
              <div>
                <Tabs
                  tabs={[
                    { tab: <Tab>Tab 1</Tab>, panel: <TabPanel>Panel 1</TabPanel> },
                    { tab: <Tab>Tab 2</Tab>, panel: <TabPanel>Panel 2</TabPanel> },
                  ]}
                />
              </div>
            </Element>

            <Element>
              <h3>Accordéon</h3>
              <div>
                <Accordion>
                  <AccordionItem label={"Accordéon"}>
                    <span>test</span>
                  </AccordionItem>
                </Accordion>
              </div>
            </Element>

            <Element>
              <h3>Alerte</h3>
              <Option>
                <h4>Type</h4>
                <Alert title={"Défaut"}>
                  <p>message</p>
                </Alert>
                <Alert title={"success"} modifiers={"success"}>
                  <p>message</p>
                </Alert>
                <Alert title={"error"} modifiers={"error"}>
                  <p>message</p>
                </Alert>
                <Alert title={"info"} modifiers={"info"}>
                  <p>message</p>
                </Alert>
              </Option>
              <Option>
                <h4>Taille</h4>
                <Alert className={"fr-alert--sm"}>
                  <p>sm</p>
                </Alert>
                <Alert className={"fr-alert--md"}>
                  <p>md</p>
                </Alert>
              </Option>
              <Option>
                <h4>Fermeture</h4>
                {showAlert && (
                  <Alert onClose={() => setShowAlert(false)}>
                    <p>closeable</p>
                  </Alert>
                )}
              </Option>
            </Element>

            <Element>
              <h3>Boutons</h3>
              <Option>
                <h4>Taille</h4>
                <Button>default</Button>
                <Button modifiers={"sm"}>sm</Button>
                <Button modifiers={"md"}>md</Button>
                <Button modifiers={"lg"}>lg</Button>
              </Option>
              <Option>
                <h4>Secondaire</h4>
                <Button modifiers={"secondary"}>Secondary</Button>
                <Button modifiers={"secondary sm"}>Secondary sm</Button>
                <Button modifiers={"secondary md"}>Secondary sm</Button>
                <Button modifiers={"secondary lg"}>secondary lg</Button>
              </Option>
              <Option>
                <h4>Désactivé</h4>
                <Button disabled={true}>Disabled</Button>
                <Button disabled={true} modifiers={"sm"}>
                  Disabled sm
                </Button>
                <Button disabled={true} modifiers={"md"}>
                  Disabled md
                </Button>
                <Button disabled={true} modifiers={"lg"}>
                  Disabled lg
                </Button>
              </Option>
              <Option>
                <h4>Boutons icône</h4>
                <Button className={icon("checkbox-circle-line")}>Icon</Button>
                <Button modifiers={"icon-right"} className={icon("checkbox-circle-line")}>
                  Icon right
                </Button>
                <Button modifiers={"icon-left"} className={icon("checkbox-circle-line")}>
                  Icon left
                </Button>
              </Option>
            </Element>

            <Element>
              <h3>Groupe de boutons</h3>
              <Option>
                <h4>Taille</h4>
                <ButtonGroup modifiers={"sm"}>
                  <Button>sm</Button>
                </ButtonGroup>
                <ButtonGroup modifiers={"md"}>
                  <Button>md</Button>
                </ButtonGroup>
                <ButtonGroup modifiers={"lg"}>
                  <Button>lg</Button>
                </ButtonGroup>
              </Option>
              <Option>
                <h4>Inline</h4>
                <ButtonGroup modifiers={"inline"}>
                  <Button>Inline 1</Button>
                </ButtonGroup>
                <ButtonGroup modifiers={"inline right"}>
                  <Button>Right 1</Button>
                </ButtonGroup>
                <ButtonGroup modifiers={"inline right inline-reverse"}>
                  <Button>Right inverse 1</Button>
                </ButtonGroup>
              </Option>
            </Element>

            <Element>
              <h3>Barre de recherche</h3>
              <div>
                <SearchBar label={"Rechercher"} />
                <SearchBar label={"Rechercher"} modifiers="lg" />
              </div>
            </Element>

            <Element>
              <h3>Champs de saisie</h3>
              <Option>
                <h4>Défaut</h4>
                <Input label={"Label"} />
              </Option>
              <Option>
                <h4>Aide</h4>
                <Input label={"Label"} hint={"hint"} />
              </Option>
              <Option>
                <h4>Désactivé</h4>
                <Input label={"Label"} disabled />
              </Option>
              <Option>
                <h4>Icône</h4>
                <Input label={"Label"} icon={"fr-fi-alert-line"} />
              </Option>
              <Option>
                <h4>Validation</h4>
                <Input label={"Label"} validation={{ type: "error", message: "une erreur" }} />
                <Input label={"Label"} validation={{ type: "valid", message: "une validation" }} />
              </Option>
            </Element>

            <Element>
              <h3>Liste déroulante</h3>
              <Option>
                <h4>Défaut</h4>
                <Select label={"Label"}>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </Select>
              </Option>
              <Option>
                <h4>Aide</h4>
                <Select label={"Label"} hint={"hint"}>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </Select>
              </Option>
              <Option>
                <h4>Désactivé</h4>
                <Select label={"Label"} disabled>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </Select>
              </Option>
              <Option>
                <h4>Validation</h4>
                <Select label={"Label"} validation={{ type: "error", message: "une erreur" }}>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </Select>
                <Select label={"Label"} validation={{ type: "valid", message: "une validation" }}>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </Select>
              </Option>
            </Element>

            <Element>
              <h3>Radio</h3>
              <Option>
                <h4>Défaut</h4>
                <Fieldset legend={"legend"}>
                  <Radio label={"radio"} hint={"hint"} />
                </Fieldset>
              </Option>
              <Option>
                <h4>Inline</h4>
                <Fieldset modifiers={"inline"} legend={"legend"}>
                  <Radio label={"radio"} name={"radio"} value={"1"} />
                  <Radio label={"radio"} name={"radio"} value={"2"} />
                </Fieldset>
              </Option>
              <Option>
                <h4>Validation</h4>
                <Fieldset validation={{ type: "error", message: "une erreur" }}>
                  <Radio label={"radio"} name={"radio"} value={"1"} />
                  <Radio label={"radio"} name={"radio"} value={"2"} />
                </Fieldset>
                <Fieldset validation={{ type: "valid", message: "une validation" }}>
                  <Radio label={"radio"} name={"radio"} value={"1"} />
                  <Radio label={"radio"} name={"radio"} value={"2"} />
                </Fieldset>
              </Option>
            </Element>

            <Element>
              <h3>Case à cocher</h3>
              <Option>
                <h4>Défaut</h4>
                <Fieldset legend={"legend"}>
                  <Checkbox label={"checkbox"} hint={"hint"} />
                  <Checkbox label={"checkbox"} hint={"hint"} />
                </Fieldset>
              </Option>
              <Option>
                <h4>Inline</h4>
                <Fieldset modifiers={"inline"} legend={"legend"}>
                  <Checkbox label={"checkbox"} hint={"hint"} />
                  <Checkbox label={"checkbox"} hint={"hint"} />
                </Fieldset>
              </Option>
              <Option>
                <h4>Validation</h4>
                <h5>Unique</h5>
                <Checkbox label={"checkbox"} validation={{ type: "error", message: "une erreur" }} />
                <Checkbox label={"checkbox"} validation={{ type: "valid", message: "une validation" }} />
                <h5>Groupe</h5>
                <Fieldset validation={{ type: "error", message: "une erreur" }}>
                  <Checkbox label={"checkbox"} />
                  <Checkbox label={"checkbox"} />
                </Fieldset>
              </Option>
            </Element>

            <Element>
              <h3>Interrupteur</h3>
              <Option>
                <h4>Défaut</h4>
                <ToggleSwitch label={"label"} />
                <ToggleSwitch label={"label"} hint={"hint"} />
                <ToggleSwitch label={"label"} modifiers={"label-left"} />
              </Option>
              <Option>
                <h4>Liste</h4>
                <ToggleList>
                  <ToggleSwitch label={"label 1"} modifiers={"border-bottom"} />
                  <ToggleSwitch label={"label 2"} modifiers={"border-bottom"} />
                </ToggleList>
              </Option>
            </Element>
          </Col>
        </Composant>
      </Container>
      <Footer
        top={{
          cat: "Catégorie 1",
          list: (
            <FooterList>
              <FooterLink to={"/"}>Lien 1</FooterLink>
              <FooterLink to={"/"}>Lien 2</FooterLink>
            </FooterList>
          ),
        }}
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
  );
}
