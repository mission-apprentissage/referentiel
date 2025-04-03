export default function Adresse({ organisme }) {
  const adresse = organisme.adresse;
  return <span>{adresse?.label || `${adresse?.code_postal || ''} ${adresse?.localite || ''}`}</span>;
}
