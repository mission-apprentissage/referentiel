/**
 * Contenu de la page d'affichage d'un organisme de formation
 */

import { useNavigate, useParams } from 'react-router-dom';

import { Tab, TabPanel } from '../../common/dsfr/elements/Tabs';
import WideTabs from '../../common/dsfr/custom/WideTabs';
import IdentiteTab from './Identite/IdentiteTab';
import RelationsTab from './relations/RelationsTab';
import LieuxDeFormationTab from './lieux/LieuxDeFormationTab';


export default function Fiche ({ organisme }) {
  const navigate = useNavigate();
  const { tab = 'identite' } = useParams();

  return (
    <WideTabs
      className={'fr-mb-3w'}
      tabs={[
        {
          tab:   <Tab selected={tab === 'identite'} onClick={() => navigate('../identite')}>
                   Identité
                 </Tab>,
          panel: <TabPanel>
                   <IdentiteTab organisme={organisme} />
                 </TabPanel>,
        },
        {
          tab:   <Tab disabled={organisme.relations.length === 0} selected={tab === 'relations'}
                      onClick={() => navigate('../relations')}>
                   Relations
                 </Tab>,
          panel: <TabPanel>
                   <RelationsTab organisme={organisme} />
                 </TabPanel>,
        },
        {
          tab:   <Tab disabled={organisme.lieux_de_formation.length === 0}
                      selected={tab === 'lieux'} onClick={() => navigate('../lieux')}>
                   Lieux de formation
                 </Tab>,
          panel: <TabPanel>
                   <LieuxDeFormationTab organisme={organisme} />
                 </TabPanel>,
        },
      ]}
    />
  );
}
