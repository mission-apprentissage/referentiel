import { asSiren } from '../utils';

export default function Siret({ organisme }) {
  return (
    <>
      <span className={'fr-mr-1v'}>{asSiren(organisme.siret)}</span>
      <span className={'fr-mr-1v'}>{organisme.siret.substring(9, 14)}</span>
      <span>{organisme.etat_administratif === 'actif' ? '(en activité)' : '(fermé)'}</span>
    </>
  );
}
