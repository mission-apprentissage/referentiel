export default function RaisonSociale ({ organisme, ...rest }) {
  return <span {...rest}>{organisme.enseigne || organisme.raison_sociale || 'Raison sociale inconnue'}</span>;
}
