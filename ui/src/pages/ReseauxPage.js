import React from "react";
import { uniqWith } from "lodash-es";
import { Card, Grid, Page } from "tabler-react";
import { ResponsiveNetwork } from "@nivo/network";
import { Link } from "react-router-dom";
import { useSearch } from "./hooks/useSearch";
import SearchForm from "./components/SearchForm";

function getEtablissementsReseau(etablissements) {
  let nodes = etablissements.map((e) => {
    return {
      id: e.siret,
      raison_sociale: e.raison_sociale,
      radius: 8,
      depth: 1,
      color: e.statut === "actif" ? "rgb(97, 205, 187)" : "rgb(205, 115, 97)",
    };
  });

  let links = etablissements.reduce((acc, e) => {
    return [
      ...acc,
      ...e.relations
        .filter((relation) => relation.annuaire && !!nodes.find((n) => n.id === relation.siret))
        .map((relation) => {
          return {
            source: e.siret,
            target: relation.siret,
          };
        }),
    ];
  }, []);

  return { nodes, links: uniqWith(links, (a, b) => `${a.source}${a.target}` === `${b.source}${b.target}`) };
}

function Reseau({ etablissements }) {
  if (etablissements.length === 0) {
    return <div />;
  }

  let { nodes, links } = getEtablissementsReseau(etablissements);

  return (
    <div style={{ height: "800px" }}>
      <ResponsiveNetwork
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        repulsivity={1}
        nodeColor={(e) => e.color}
        nodeBorderWidth={1}
        nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
        nodes={nodes}
        animate={true}
        links={links}
        tooltip={(node) => {
          return <div>{node.raison_sociale}</div>;
        }}
      />
    </div>
  );
}

export default () => {
  let [{ data, loading, error }, search] = useSearch({
    items_par_page: 5000,
    champs: "siret,statut,raison_sociale,relations",
  });

  return (
    <Page>
      <Page.Main>
        <Page.Content>
          <Page.Header>
            <Link to={`/`}>Annuaire</Link>> Réseaux
          </Page.Header>
          <Grid.Row>
            <Grid.Col>
              <SearchForm search={search} error={error} />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col>
              <Card>
                <Card.Header>
                  <Card.Title>Réseaux</Card.Title>
                </Card.Header>
                <Card.Body>
                  {loading || data.etablissements.length === 0 ? (
                    <div>{loading ? "Chargement..." : "Pas de résultats"}</div>
                  ) : (
                    <Reseau etablissements={data.etablissements} />
                  )}
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Page.Content>
      </Page.Main>
    </Page>
  );
};
