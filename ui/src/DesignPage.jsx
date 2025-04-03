import { Children, useState } from 'react';
import { Accordion, AccordionItem } from './common/dsfr/elements/Accordion.jsx';
import SearchBar from './common/dsfr/elements/SearchBar.jsx';
import Alert from './common/dsfr/elements/Alert.jsx';
import { Button, ButtonGroup } from './common/dsfr/elements/Button.jsx';
import { Col, Container, GridRow } from './common/dsfr/fondamentaux';
import styled from 'styled-components';
import Radio from './common/dsfr/elements/Radio.jsx';
import Checkbox from './common/dsfr/elements/Checkbox.jsx';
import Fieldset from './common/dsfr/elements/Fieldset.jsx';
import { Footer, FooterLink, FooterList } from './common/dsfr/elements/Footer.jsx';
import Input from './common/dsfr/elements/Input.jsx';
import Select from './common/dsfr/elements/Select.jsx';
import { ToggleList, ToggleSwitch } from './common/dsfr/elements/ToggleSwitch.jsx';
import { Tab, TabPanel, Tabs } from './common/dsfr/elements/Tabs.jsx';
import { Header } from './common/dsfr/elements/Header.jsx';
import { Link, LinkGroup } from './common/dsfr/elements/Link.jsx';
import { Nav, NavButton, NavLink } from './common/dsfr/elements/Nav.jsx';
import { Table, Thead } from './common/dsfr/elements/Table.jsx';

const Colored = styled.div`
  background-color: ${(props) => props.color};
`;

function Composant({ children }) {
  return <GridRow className={'fr-pt-3w'}>{children}</GridRow>;
}

function Element({ title, children }) {
  return (
    <div className={'fr-mt-8w'}>
      <h4>{title}</h4>
      {children}
    </div>
  );
}

function Option({ title, children }) {
  return (
    <div className={'fr-mt-4w'}>
      <h6>{title}</h6>
      <GridRow modifiers={'gutters'}>
        {Children.toArray(children).map((child) => (
          <Col>{child}</Col>
        ))}
      </GridRow>
    </div>
  );
}

export default function DesignPage() {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div>
      <Header
        title={'Nom du service'}
        tagline={'Précisions sur l‘organisation'}
        links={
          <LinkGroup>
            <Link to="/" icons="add-circle-line">
              Créer un espace
            </Link>
            <Link to="/" icons="lock-line">
              Se connecter
            </Link>
            <Link to="/" icons="account-line">
              S’enregistrer
            </Link>
          </LinkGroup>
        }
        nav={
          <Nav>
            <NavButton text={'Menu'} aria-current={'page'}>
              <NavLink to="/">SubNavLink 1</NavLink>
              <NavLink to="/">SubNavLink 2</NavLink>
            </NavButton>
            <NavLink to="/">NavLink 1</NavLink>
            <NavLink to="/">NavLink 2</NavLink>
          </Nav>
        }
        search={<SearchBar label={'Recherche'} />}
      />
      <Container>
        <Composant>
          <Col>
            <h2>Fondamentaux</h2>
            <Element title={'Grille'}>
              <Option title={'Défaut'}>
                <Container>
                  <GridRow modifiers={'left gutters'}>
                    <Col modifiers={'2'}>
                      <Colored color={'red'}>2</Colored>
                    </Col>
                    <Col modifiers={'6'}>
                      <Colored color={'green'}>6</Colored>
                    </Col>
                    <Col modifiers={'sm-2 md-3 lg-4'}>
                      <Colored color={'blue'}>sm: 2, md: 3, lg: 4</Colored>
                    </Col>
                  </GridRow>
                </Container>
              </Option>
              <Option title={'Fluide'}>
                <Container modifiers={'fluid'}>
                  <GridRow>
                    <Col>
                      <Colored color={'red'}>12</Colored>
                    </Col>
                    <Col>
                      <Colored color={'red'}>12</Colored>
                    </Col>
                  </GridRow>
                </Container>
              </Option>
            </Element>
          </Col>
        </Composant>
        <Composant>
          <Col>
            <h2 className={'fr-mt-8w'}>Éléments d'interface</h2>

            <Element title={'Tabs'}>
              <div>
                <Tabs
                  tabs={[
                    { tab: <Tab>Tab 1</Tab>, panel: <TabPanel>Panel 1</TabPanel> },
                    { tab: <Tab>Tab 2</Tab>, panel: <TabPanel>Panel 2</TabPanel> },
                  ]}
                />
              </div>
            </Element>

            <Element title={'Accordéon'}>
              <div>
                <Accordion>
                  <AccordionItem label={'Accordéon'}>
                    <span>test</span>
                  </AccordionItem>
                </Accordion>
              </div>
            </Element>

            <Element title={'Tableau'}>
              <div>
                <Table
                  caption={'Caption'}
                  modifiers={'bordered'}
                  thead={
                    <Thead>
                      <td>col 1</td>
                      <td>col 2</td>
                    </Thead>
                  }
                >
                  <tr>
                    <td>val 1</td>
                    <td>val 2</td>
                  </tr>
                  <tr>
                    <td>val 1</td>
                    <td>val 2</td>
                  </tr>
                </Table>
              </div>
            </Element>

            <Element title={'Alerte'}>
              <Option title={'Type'}>
                <Alert title={'Défaut'}>
                  <p>message</p>
                </Alert>
                <Alert title={'success'} modifiers={'success'}>
                  <p>message</p>
                </Alert>
                <Alert title={'error'} modifiers={'error'}>
                  <p>message</p>
                </Alert>
                <Alert title={'info'} modifiers={'info'}>
                  <p>message</p>
                </Alert>
              </Option>
              <Option title={'Taille'}>
                <Alert className={'fr-alert--sm'}>
                  <p>sm</p>
                </Alert>
                <Alert className={'fr-alert--md'}>
                  <p>md</p>
                </Alert>
              </Option>
              <Option title={'Fermeture'}>
                {showAlert && (
                  <Alert onClose={() => setShowAlert(false)}>
                    <p>closeable</p>
                  </Alert>
                )}
              </Option>
            </Element>

            <Element title={'Boutons'}>
              <Option title={'Taille'}>
                <Button>default</Button>
                <Button modifiers={'sm'}>sm</Button>
                <Button modifiers={'md'}>md</Button>
                <Button modifiers={'lg'}>lg</Button>
              </Option>
              <Option title={'Secondaire'}>
                <Button modifiers={'secondary'}>Secondary</Button>
                <Button modifiers={'secondary sm'}>Secondary sm</Button>
                <Button modifiers={'secondary md'}>Secondary sm</Button>
                <Button modifiers={'secondary lg'}>secondary lg</Button>
              </Option>
              <Option title={'Tertiaire'}>
                <Button modifiers={'tertiary'}>Secondary</Button>
                <Button modifiers={'tertiary sm'}>Secondary sm</Button>
                <Button modifiers={'tertiary md'}>Secondary sm</Button>
                <Button modifiers={'tertiary lg'}>secondary lg</Button>
              </Option>
              <Option title={'Désactivé'}>
                <Button disabled={true}>Disabled</Button>
                <Button disabled={true} modifiers={'sm'}>
                  Disabled sm
                </Button>
                <Button disabled={true} modifiers={'md'}>
                  Disabled md
                </Button>
                <Button disabled={true} modifiers={'lg'}>
                  Disabled lg
                </Button>
              </Option>
              <Option title={'Boutons'}>
                <Button icons={'checkbox-circle-line'}>Icon</Button>
                <Button modifiers={'icon-right'} icons={'checkbox-circle-line'}>
                  Icon right
                </Button>
                <Button modifiers={'icon-left'} icons={'checkbox-circle-line'}>
                  Icon left
                </Button>
              </Option>
            </Element>

            <Element title={'Groupe de boutons'}>
              <Option title={'Taille'}>
                <ButtonGroup modifiers={'sm'}>
                  <Button>sm</Button>
                </ButtonGroup>
                <ButtonGroup modifiers={'md'}>
                  <Button>md</Button>
                </ButtonGroup>
                <ButtonGroup modifiers={'lg'}>
                  <Button>lg</Button>
                </ButtonGroup>
              </Option>
              <Option title={'Inline'}>
                <ButtonGroup modifiers={'inline'}>
                  <Button>Inline 1</Button>
                </ButtonGroup>
                <ButtonGroup modifiers={'inline right'}>
                  <Button>Right 1</Button>
                </ButtonGroup>
                <ButtonGroup modifiers={'inline right inline-reverse'}>
                  <Button>Right inverse 1</Button>
                </ButtonGroup>
              </Option>
            </Element>

            <Element title={'Barre de recherche'}>
              <Option title={'Tailles'}>
                <SearchBar label={'Rechercher'} />
                <SearchBar label={'Rechercher'} modifiers="lg" />
              </Option>
            </Element>

            <Element title={'Champs de saisie'}>
              <Option title={'Défaut'}>
                <Input label={'Label'} />
              </Option>
              <Option title={'Aide'}>
                <Input label={'Label'} hint={'hint'} />
              </Option>
              <Option title={'Désactivé'}>
                <Input label={'Label'} disabled />
              </Option>
              <Option title={'Icône'}>
                <Input label={'Label'} icons={'alert-line'} />
              </Option>
              <Option title={'Validation'}>
                <Input label={'Label'} validation={{ type: 'error', message: 'une erreur' }} />
                <Input label={'Label'} validation={{ type: 'valid', message: 'une validation' }} />
              </Option>
            </Element>

            <Element title={'Liste déroulante'}>
              <Option title={'Défaut'}>
                <Select label={'Label'}>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </Select>
              </Option>
              <Option title={'Aide'}>
                <Select label={'Label'} hint={'hint'}>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </Select>
              </Option>
              <Option title={'Désactivé'}>
                <Select label={'Label'} disabled>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </Select>
              </Option>
              <Option title={'Validation'}>
                <Select label={'Label'} validation={{ type: 'error', message: 'une erreur' }}>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </Select>
                <Select label={'Label'} validation={{ type: 'valid', message: 'une validation' }}>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </Select>
              </Option>
            </Element>

            <Element title={'Radio'}>
              <Option title={'Défaut'}>
                <Fieldset legend={'legend'}>
                  <Radio label={'radio'} hint={'hint'} />
                </Fieldset>
              </Option>
              <Option title={'Inline'}>
                <Fieldset modifiers={'inline'} legend={'legend'}>
                  <Radio label={'radio'} name={'radio'} value={'1'} />
                  <Radio label={'radio'} name={'radio'} value={'2'} />
                </Fieldset>
              </Option>
              <Option title={'Validation'}>
                <Fieldset validation={{ type: 'error', message: 'une erreur' }}>
                  <Radio label={'radio'} name={'radio'} value={'1'} />
                  <Radio label={'radio'} name={'radio'} value={'2'} />
                </Fieldset>
                <Fieldset validation={{ type: 'valid', message: 'une validation' }}>
                  <Radio label={'radio'} name={'radio'} value={'1'} />
                  <Radio label={'radio'} name={'radio'} value={'2'} />
                </Fieldset>
              </Option>
            </Element>

            <Element title={'Case à cocher'}>
              <Option title={'Défaut'}>
                <Fieldset legend={'legend'}>
                  <Checkbox label={'checkbox'} hint={'hint'} />
                  <Checkbox label={'checkbox'} hint={'hint'} />
                </Fieldset>
              </Option>
              <Option title={'Inline'}>
                <Fieldset modifiers={'inline'} legend={'legend'}>
                  <Checkbox label={'checkbox'} hint={'hint'} />
                  <Checkbox label={'checkbox'} hint={'hint'} />
                </Fieldset>
              </Option>
              <Option title={'Validation'}>
                <h5>Unique</h5>
                <Checkbox label={'checkbox'} validation={{ type: 'error', message: 'une erreur' }} />
                <Checkbox label={'checkbox'} validation={{ type: 'valid', message: 'une validation' }} />
                <h5>Groupe</h5>
                <Fieldset validation={{ type: 'error', message: 'une erreur' }}>
                  <Checkbox label={'checkbox'} />
                  <Checkbox label={'checkbox'} />
                </Fieldset>
              </Option>
            </Element>

            <Element title={'Interrupteur'}>
              <Option title={'Défaut'}>
                <ToggleSwitch label={'label'} />
                <ToggleSwitch label={'label'} hint={'hint'} />
                <ToggleSwitch label={'label'} modifiers={'label-left'} />
              </Option>
              <Option title={'Liste'}>
                <ToggleList>
                  <ToggleSwitch label={'label 1'} modifiers={'border-bottom'} />
                  <ToggleSwitch label={'label 2'} modifiers={'border-bottom'} />
                </ToggleList>
              </Option>
            </Element>
          </Col>
        </Composant>
      </Container>
      <Footer
        top={{
          cat: 'Catégorie 1',
          list: (
            <FooterList>
              <FooterLink to={'/'}>Lien 1</FooterLink>
              <FooterLink to={'/'}>Lien 2</FooterLink>
            </FooterList>
          ),
        }}
        content={{
          desc: <span>Lorem [...] elit ut.</span>,
          list: (
            <FooterList>
              <FooterLink to={'/'}>Lien 1</FooterLink>
              <FooterLink to={'/'}>Lien 2</FooterLink>
            </FooterList>
          ),
        }}
        bottom={{
          list: (
            <FooterList>
              <FooterLink to={'/'}>Lien 1</FooterLink>
              <FooterLink to={'/'}>Lien 2</FooterLink>
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
