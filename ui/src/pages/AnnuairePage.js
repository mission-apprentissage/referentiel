import React from "react";
import { Button, Card, Grid, Page, Table } from "tabler-react";
import { Link, useHistory } from "react-router-dom";
import SortButton from "./components/SortButton";
import styled from "styled-components";
import Pagination from "./components/Pagination";
import SearchForm from "./components/SearchForm";
import { useSearch } from "./hooks/useSearch";

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
`;

export default () => {
  let history = useHistory();
  let [{ data, loading, error }, search] = useSearch({ anomalies: false });

  return (
    <Page>
      <Page.Main>
        <Page.Content>
          <Page.Header>
            <Header>
              <Link to={`/`}>Annuaire</Link>
              <Buttons>
                <Button color={"info"} onClick={() => history.push("/stats")}>
                  Stats
                </Button>
                <Button color={"danger"} onClick={() => history.push("/anomalies")}>
                  Voir le rapport d'anomalies >
                </Button>
              </Buttons>
            </Header>
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
                  <Card.Title>Résultats</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColHeader>Siret</Table.ColHeader>
                        <Table.ColHeader>Uai</Table.ColHeader>
                        <Table.ColHeader>Nom</Table.ColHeader>
                        <Table.ColHeader>
                          UAI
                          <SortButton onClick={(ordre) => search({ page: 1, tri: "uais", ordre })} />
                        </Table.ColHeader>
                        <Table.ColHeader>
                          Relations <SortButton onClick={(ordre) => search({ page: 1, tri: "relations", ordre })} />
                        </Table.ColHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {loading || data.etablissements.length === 0 ? (
                        <Table.Row>
                          <Table.Col colSpan={4}>{loading ? "Chargement..." : "Pas de résultats"}</Table.Col>
                        </Table.Row>
                      ) : (
                        data.etablissements.map((e) => {
                          return (
                            <Table.Row key={e.siret}>
                              <Table.Col>
                                <Link to={`/etablissements/${e.siret}`}>{e.siret}</Link>
                              </Table.Col>
                              <Table.Col>{e.uai} </Table.Col>
                              <Table.Col>{e.raison_sociale}</Table.Col>
                              <Table.Col>{e.uais.length}</Table.Col>
                              <Table.Col>{e.relations.length}</Table.Col>
                            </Table.Row>
                          );
                        })
                      )}
                    </Table.Body>
                  </Table>
                  <Pagination pagination={data.pagination} onClick={(page) => search({ page })} />
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Page.Content>
      </Page.Main>
    </Page>
  );
};
