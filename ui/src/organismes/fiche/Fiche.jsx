import { Tab, TabPanel } from '../../common/dsfr/elements/Tabs.jsx';
import IdentiteTab from './Identite/IdentiteTab.jsx';
import RelationsTab from './relations/RelationsTab.jsx';
import WideTabs from '../../common/dsfr/custom/WideTabs.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import LieuxDeFormationTab from './lieux/LieuxDeFormationTab.jsx';

export default function Fiche({ organisme }) {
  const navigate = useNavigate();
  const { tab = 'identite' } = useParams();

  return (
    <WideTabs
      className={'fr-mb-3w'}
      tabs={[
        {
          tab: (
            <Tab selected={tab === 'identite'} onClick={() => navigate('../identite')}>
              Identité
            </Tab>
          ),
          panel: (
            <TabPanel>
              <IdentiteTab organisme={organisme} />
            </TabPanel>
          ),
        },
        {
          tab: (
            <Tab
              disabled={organisme.relations.length === 0}
              selected={tab === 'relations'}
              onClick={() => navigate('../relations')}
            >
              Relations
            </Tab>
          ),
          panel: (
            <TabPanel>
              <RelationsTab organisme={organisme} />
            </TabPanel>
          ),
        },
        {
          tab: (
            <Tab
              disabled={organisme.lieux_de_formation.length === 0}
              selected={tab === 'lieux'}
              onClick={() => navigate('../lieux')}
            >
              Lieux de formation
            </Tab>
          ),
          panel: (
            <TabPanel>
              <LieuxDeFormationTab organisme={organisme} />
            </TabPanel>
          ),
        },
      ]}
    />
  );
}
