import React from "react";
import TitleLayout from "./common/layout/TitleLayout.jsx";
import ContentLayout from "./common/layout/ContentLayout.jsx";
import Page from "./common/Page.jsx";
import { Col, GridRow } from "./common/dsfr/fondamentaux/index.js";

export default function DonneesPersonnellesPages() {
  return (
    <Page>
      <TitleLayout title={"Données personnelles"} />
      <ContentLayout>
        <GridRow>
          <Col modifiers={"12"}>
            <p>
              Vous trouverez ci-dessous la présentation de la gestion des données personnelles sur le présent site,
              conformément à la législation en vigueur. L’Onisep s’engage à traiter vos données à caractère personnel
              dans le respect de la{" "}
              <a href="https://www.cnil.fr/fr/la-loi-informatique-et-libertes" target="_blank" rel="noreferrer">
                loi n° 78-17 du 6 janvier 1978 modifiée, relative à l'informatique, aux fichiers et aux libertés
              </a>{" "}
              et du "
              <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees" target="_blank" rel="noreferrer">
                Règlement général sur la protection des données
              </a>
              " (RGPD).
            </p>
            <h6>Qui traite vos données ?</h6>
            <p>
              L’Office National d'Information Sur les Enseignements et les Professions (Onisep), établissement public à
              caractère administratif régi par les articles L.313-6 et D.313-14 à D.313-33 du Code de l'Éducation,
              représenté par sa Directrice générale, Frédérique ALEXANDRE-BAILLY.
            </p>
            <ul>
              <li>Adresse : 12 mail Barthélémy Thimonnier, 77437 Marne la Vallée cedex 2 CS 10450</li>
              <li>Standard : 01 64 80 35 00</li>
              <li>Numéro SIRET : 180 043 028 00653</li>
              <li>Numéro SIREN : 180043028</li>
              <li>Numéro de TVA Intracommunautaire : TVA INTRA FR19180043028</li>
            </ul>
            <p>
              En tant que responsable de traitement, l’Onisep s'engage à prendre toutes les mesures nécessaires
              permettant de garantir la sécurité, la protection, l’intégrité et la confidentialité des informations
              fournies par les usagers.
            </p>
            <h6>Quelle est la finalité et la base légale du traitement de vos données ?</h6>
            <p>
              Nous collectons votre adresse e-mail afin de créer votre compte utilisateur qui vous permettra d’accéder
              de façon sécurisée à l’espace de fiabilisation des couples UAI-SIRET au sein du Référentiel. La création
              de votre compte a pour base légale votre consentement. Les données personnelles fournies sont nécessaires
              pour assurer la création du compte et son bon fonctionnement, vous permettre de vous identifier et vous
              authentifier.
            </p>
            <h6>Quelles sont les données concernées par le traitement et combien de temps sont-elles conservées ?</h6>
            <p>
              L’Onisep s'engage à ce que vos données soient conservées pendant une durée qui n'excède pas celle
              nécessaire au regard des finalités pour lesquelles elles sont traitées :
            </p>
            <ul>
              <li>
                Nous collectons les informations de contact suivantes : civilité, nom, prénom, adresse e-mail. Ces
                données personnelles sont conservées 2 ans maximum à partir de la suppression du compte utilisateur,
              </li>
              <li>
                Les journaux de connexion (logs) contenant des adresses IP et autres données à caractère personnel sont
                conservés pour une période de 12 mois glissants pour répondre aux exigences légales, soit au maximum
                pour une durée de 13 mois après l’extinction des services.
              </li>
            </ul>
            <h6>Qui est destinataire de vos données ?</h6>
            <p>
              L’Onisep s'engage à n'opérer aucune commercialisation des informations et documents transmis par l'usager
              au moyen du présent site, et à ne pas les communiquer à des tiers, en dehors des cas prévus par la loi.
            </p>
            <p>
              Des données personnelles peuvent dans une certaine mesure être rendues accessibles aux prestataires
              (sous-traitants au sens de la règlementation applicable) de l’Onisep sous son contrôle, pour les stricts
              besoins et dans les limites de leurs missions. Ces sous-traitants sont soumis à une obligation de
              confidentialité et ne peuvent utiliser les données à caractère personnel que conformément à la législation
              applicable et aux dispositions contractuelles spécifiquement conclues avec l’Onisep.
            </p>
            <p>Vos données personnelles sont accessibles à différents interlocuteurs :</p>
            <ul>
              <li>Administrateurs techniques et fonctionnels Onisep,</li>
              <li>
                Prestataires sous-traitants, en charge de la tierce maintenance applicative et de l’hébergement des
                données, selon leur besoin d’en connaître. Pour assurer le bon fonctionnement technique de certaines
                fonctionnalités de la plateforme, des transferts de données personnelles, limités au strict nécessaire,
                sont effectués par des sous-traitants de l’Onisep. L’Onisep s’est assuré au préalable que ces transferts
                présentaient un niveau de protection des données adéquat et suffisant au sens de la réglementation
                applicable.
              </li>
            </ul>
            <p>Les données sont hébergées par l’ONISEP et OVH sur le territoire de l’Union européenne.</p>
            <h6>Quels sont vos droits sur vos données personnelles et comment les exercer ?</h6>
            <p>
              Vous disposez d’un droit d’opposition (retrait du consentement), d’un droit d’information et d’accès aux
              données qui vous concernent, ainsi que d’un droit de rectification et, dans certains cas, d’un droit
              d’effacement (suppression) et de limitation du traitement.
            </p>
            <p>
              Conformément au règlement européen sur la protection des données personnelles (RGPD), vous pouvez exercer
              vos droits Informatique et Libertés en nous contactant :
            </p>
            <ul>
              <li>
                par courriel à l'adresse suivante : <a href="mailto:dpo@onisep.fr">dpo@onisep.fr</a>
              </li>
              <li>
                ou par courrier à l’adresse suivante : Onisep, à l’attention du Délégué à la protection des données
                personnelles, 12, mail Barthélémy-Thimonnier, 77437 Marne la Vallée cedex 2 CS 10450.
              </li>
            </ul>
            <p>
              De la même manière, vous pouvez exercer les droits prévus à l’article 40-1 de la loi n° 78-17 du 6 janvier
              1978 relative à l’informatique, aux fichiers et aux libertés.
            </p>
            <p>
              Pour en savoir plus sur la gestion des données personnelles sur les sites de l’Onisep, n’hésitez pas à
              consulter notre rubrique{" "}
              <a href="https://www.onisep.fr/donnees-personnelles" target="_blank" rel="noreferrer">
                Données personnelles
              </a>
              .
            </p>
            <p>
              Pour en savoir plus sur vos droits en matière de données personnelles, n’hésitez pas à consulter{" "}
              <a
                href="https://www.cnil.fr/fr/mes-demarches/les-droits-pour-maitriser-vos-donnees-personnelles"
                target="_blank"
                rel="noreferrer"
              >
                le site de la commission nationale de l'informatique et des libertés (CNIL)
              </a>
              .
            </p>
            <p>
              Si vous estimez, après nous avoir contactés, que vos droits en matière de protection des données à
              caractère personnel ne sont pas respectés, vous avez la possibilité d’introduire une réclamation auprès de
              la CNIL à l’adresse suivante : 3 Place de Fontenoy - TSA 80715 – 75334 Paris Cedex 07.
            </p>
            <p>
              Dans le cadre de l’exercice de vos droits, vous devez justifier de votre identité par tout moyen. En cas
              de doute sur votre identité, les services chargés du droit d’accès et le délégué à la protection des
              données se réservent le droit de vous demander les informations supplémentaires qui leur apparaissent
              nécessaires, y compris la photocopie d’un titre d’identité portant votre signature.
            </p>
            <h6>Cookies</h6>
            <p>
              <b>Qu’est-ce qu’un cookie ?</b>
            </p>
            <p>
              Lors de leur navigation sur notre site, les internautes laissent des traces informatiques. Cet ensemble
              d'informations est recueilli à l'aide d'un témoin de connexion appelé cookie. Un cookie est un fichier de
              taille limitée, généralement constitué de lettres et de chiffres, envoyé par le serveur internet et stocké
              sur votre ordinateur.
            </p>
            <p>Les cookies sont déposés sur l’équipement de l'internaute sont :</p>
            <ul>
              <li>
                <b>Les cookies fonctionnels</b> veillent au bon fonctionnement de notre site web, notamment pour
                sécuriser votre connexion. Nous vous conseillons vivement de les maintenir actifs. Cependant, vous
                pouvez les désactiver en consultant la rubrique aide de votre navigateur;
              </li>
              <li>
                <b>Aucun cookie de mesure d’audience n’est utilisé sur ce site.</b>
              </li>
            </ul>
            <p>
              <b>Comment supprimer les cookies ?</b>
            </p>
            <p>
              Vous pouvez vous opposer à l’enregistrement de cookies en configurant les paramètres du navigateur de
              votre équipement ou de les supprimer sans que cela ait une quelconque influence sur votre accès aux pages
              du site et aux services.
            </p>
          </Col>
        </GridRow>
      </ContentLayout>
    </Page>
  );
}
