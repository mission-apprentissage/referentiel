import TitleLayout from './common/layout/TitleLayout.jsx';
import ContentLayout from './common/layout/ContentLayout.jsx';
import Page from './common/Page.jsx';
import { Col, GridRow } from './common/dsfr/fondamentaux';
import { Link } from 'react-router-dom';

export default function MentionsLegalesPages() {
  return (
    <Page>
      <TitleLayout title={'Mentions légales'} />
      <ContentLayout>
        <GridRow>
          <Col modifiers={'12'}>
            <h6>Identification de l'éditeur</h6>
            <p>
              Office National d'Information Sur les Enseignements et les Professions (Onisep), établissement public à
              caractère administratif régi par les articles L.313-6 et D.313-14 à D.313-33 du Code de l'Éducation
            </p>
            <ul>
              <li> Adresse : 12 mail Barthélémy Thimonnier, 77437 Marne la Vallée cedex 2 CS 10450</li>
              <li> Standard : 01 64 80 35 00</li>
              <li> Numéro SIRET : 180 043 028 00653</li>
              <li> Numéro SIREN : 180043028</li>
              <li> Numéro de TVA Intracommunautaire : TVA INTRA FR19180043028</li>
            </ul>
            <h6>Contact</h6>
            <p>
              Courriel : <a href="mailto:referentiel-uai-siret@onisep.fr">referentiel-uai-siret@onisep.fr</a>
            </p>
            <h6>Mentions éditoriales</h6>
            <p>Directrice de la publication : Frédérique Alexandre-Bailly, Directrice générale de l’Onisep</p>
            <h6>Hébergement</h6>
            <p>OVH</p>
            <h6>Traitement des données à caractère personnel</h6>
            <p>
              Pour plus de détail, voir la page : <Link to="/donnees-personnelles">Données personnelles</Link>
            </p>
            <h6>Liens hypertextes</h6>
            <p>
              Le présent site peut proposer certains liens vers d’autres sites, essentiellement des sites officiels
              (gouvernements, institutions, organismes publics, etc.) mais il peut également s’agir de liens vers des
              associations et organismes privés. Ces liens ne visent qu’à permettre à l’internaute de trouver plus
              facilement d’autres ressources documentaires sur le sujet consulté. Nous indiquons systématiquement vers
              quel site nous vous proposons d’aller. Cependant, ces pages web dont les adresses sont régulièrement
              vérifiées ne font pas partie des sites de l’Onisep : elles n’engagent pas la responsabilité de la
              rédaction du site.
            </p>
            <p>
              Tout site public ou privé est autorisé à établir, sans autorisation préalable, un lien vers les
              informations diffusées sur le présent site. Ainsi, que le lien soit simple ou profond, l’Onisep autorise
              la mention d’un contenu de son site à condition qu’il soit bien représenté comme tel, à savoir comme
              appartenant effectivement à l’Onisep. En revanche, les pages du présent site ne doivent pas être
              imbriquées à l’intérieur des pages d’un autre site.
            </p>
            <h6>Propriété intellectuelle</h6>
            <p>
              Le contenu du site (textes, sons, images, photographies, schémas, logo, marques, etc.) est protégé par le
              droit de la propriété intellectuelle. Sous réserve des exceptions légales prévues par le Code de la
              propriété intellectuelle et le Code des relations entre le public et l’administration, toute reproduction
              et/ou communication de tout ou partie du contenu du site est soumise à autorisation préalable et expresse
              de l’Onisep.
            </p>
            <p>
              Pour toute demande d’autorisation de reproduction, veuillez adresser un courriel à l’adresse suivante :{' '}
              <a href="mailto:servicejuridique@onisep.fr">servicejuridique@onisep.fr</a>.
            </p>
            <p>
              L’utilisation des différents contenus du site protégés par le droit de la propriété intellectuelle ou le
              droit de la propriété industrielle sans autorisation écrite de l’Onisep, sur tout support, à des fins de
              valorisation de produits ou de services, notamment à des fins commerciales, est interdite sous peine de
              poursuites.
            </p>
            <p>
              L’Onisep produit des informations publiques définies par l’article L. 300-2 du Code des relations entre le
              public et l’administration. Les documents qui ne sont pas grevés de droits de tiers sont mis à disposition
              gratuitement par l’Onisep sur le site{' '}
              <a target="_blank" rel="noreferrer" href="https://opendata.onisep.fr/">
                https://opendata.onisep.fr
              </a>
              . Ils peuvent faire l’objet d’une réutilisation prévue dans les conditions figurant sur le site.
            </p>
          </Col>
        </GridRow>
      </ContentLayout>
    </Page>
  );
}
