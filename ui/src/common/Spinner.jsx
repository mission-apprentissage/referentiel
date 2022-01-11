import Alert from "./dsfr/elements/Alert";

export default function Spinner({ loading, error }) {
  if (loading) {
    return <span>En cours de chargement...</span>;
  } else if (error) {
    return (
      <Alert modifiers={"error"} title={"Une erreur survenue"}>
        Impossible de réaliser la recherche
      </Alert>
    );
  } else {
    return <span />;
  }
}
