import React from "react";
import styled from "styled-components";
import { sortBy } from "lodash-es";
import { Card, Grid, Page, Table } from "tabler-react";
import { Link } from "react-router-dom";
import { useFetch } from "../common/hooks/useFetch";
import Error from "../common/components/Error";
import FixedTable from "./components/FixedTable";

export default StatsPage;

export const StatsCard = styled(({ children, ...rest }) => {
  return (
    <Card {...rest}>
      <Card.Body className="stats">{children}</Card.Body>
    </Card>
  );
})`
  height: 75%;
  .stats {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .value {
      font-size: 1.5rem;
      font-weight: 600;
    }
    .details {
      font-size: 0.9rem;
      font-weight: 400;
    }
  }
`;

function Percentage({ total, value, details = () => value }) {
  let computed = Math.round((value * 100) / total);
  return (
    <div>
      <div>{computed}%</div>
      {<div className={"value"}>{details(computed)}</div>}
    </div>
  );
}

function Matrice({ matrice }) {
  let sourcesNames = Object.keys(matrice).sort();

  return (
    <FixedTable>
      <Table.Header>
        <Table.ColHeader>
          <div>-</div>
        </Table.ColHeader>
        {sourcesNames.map((sourceName) => {
          return (
            <Table.ColHeader key={sourceName}>
              <div>{sourceName}</div>
              <div className={"value"}>{matrice[sourceName][sourceName].union}</div>
            </Table.ColHeader>
          );
        })}
      </Table.Header>
      <Table.Body>
        {sourcesNames.map((sourceName) => {
          let source = matrice[sourceName];
          let otherSourceNames = sortBy(Object.keys(source).filter((n) => n !== "total"));
          let total = source[sourceName].union;

          return (
            <Table.Row key={sourceName}>
              <Table.Col>
                <div>{sourceName}</div>
                <div className={"value"}>{total}</div>
              </Table.Col>
              {otherSourceNames.map((otherSourceName) => {
                let otherSource = source[otherSourceName];

                return (
                  <Table.Col key={otherSourceName}>
                    {sourceName === otherSourceName ? (
                      <span>-</span>
                    ) : (
                      <Percentage
                        value={otherSource.intersection}
                        total={total}
                        details={() => (
                          <div>
                            <div>trouvés dans {otherSourceName.toUpperCase()}</div>
                            <div>{`${otherSource.union} uniques dans les 2 sources`}</div>
                            <div>{`dont ${otherSource.intersection} en commun`}</div>
                          </div>
                        )}
                      />
                    )}
                  </Table.Col>
                );
              })}
            </Table.Row>
          );
        })}
      </Table.Body>
    </FixedTable>
  );
}

function Recoupement({ recoupement }) {
  return (
    <Grid.Row>
      <Grid.Col width={3}>
        <StatsCard>
          <div>Total</div>
          <div className="value">{recoupement.total}</div>
        </StatsCard>
      </Grid.Col>
      <Grid.Col width={3}>
        <StatsCard>
          <div>Trouvés dans toutes les sources</div>
          <div className="value">
            <Percentage total={recoupement.total} value={recoupement["3"]} details={() => <div />} />
          </div>
        </StatsCard>
      </Grid.Col>
      <Grid.Col width={3}>
        <StatsCard>
          <div>Trouvés dans 2 sources sur 3</div>
          <div className="value">
            <Percentage total={recoupement.total} value={recoupement["2"]} details={() => <div />} />
          </div>
        </StatsCard>
      </Grid.Col>
      <Grid.Col width={3}>
        <StatsCard>
          <div>Trouvés dans 1 sources sur 3</div>
          <div className="value">
            <Percentage total={recoupement.total} value={recoupement["1"]} details={() => <div />} />
          </div>
        </StatsCard>
      </Grid.Col>
    </Grid.Row>
  );
}

function StatsPage() {
  let [data, loading, error] = useFetch(`/api/v1/stats`, { stats: [{}] });
  let { validation, matrices, recoupements } = data.stats[0];

  if (loading || data.stats.length === 0) {
    return <div>{loading ? "Chargement..." : "Pas de résultats"}</div>;
  }

  return (
    <Page>
      <Page.Main>
        <Page.Content>
          <Page.Header>
            <Link to={`/`}>Référentiel</Link>> Stats
          </Page.Header>
          {validation && (
            <>
              <h2>Validation des établissements</h2>
              {error && <Error>Une erreur est survenue</Error>}
              <Grid.Row>
                <Grid.Col width={7}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Validité des uais</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <FixedTable>
                        <Table.Header>
                          <Table.ColHeader>Source</Table.ColHeader>
                          <Table.ColHeader>Valides</Table.ColHeader>
                          <Table.ColHeader>Invalides</Table.ColHeader>
                          <Table.ColHeader>Absents</Table.ColHeader>
                        </Table.Header>
                        <Table.Body>
                          {Object.keys(validation)
                            .sort()
                            .map((key) => {
                              let { total, uais } = validation[key];

                              return (
                                <Table.Row key={key}>
                                  <Table.Col>
                                    <div>{key}</div>
                                    <div className="value">{total}</div>
                                  </Table.Col>
                                  <Table.Col>
                                    <Percentage total={total} value={uais.valides} />
                                  </Table.Col>
                                  <Table.Col>
                                    <Percentage total={total} value={uais.invalides} />
                                  </Table.Col>
                                  <Table.Col>
                                    <Percentage total={total} value={uais.absents} />
                                  </Table.Col>
                                </Table.Row>
                              );
                            })}
                        </Table.Body>
                      </FixedTable>
                    </Card.Body>
                  </Card>
                </Grid.Col>
                <Grid.Col width={5}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Unicité des uais valides</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <FixedTable>
                        <Table.Header>
                          <Table.ColHeader>Source</Table.ColHeader>
                          <Table.ColHeader>Uniques</Table.ColHeader>
                          <Table.ColHeader>Dupliqués</Table.ColHeader>
                        </Table.Header>
                        <Table.Body>
                          {Object.keys(validation)
                            .sort()
                            .map((key) => {
                              let uais = validation[key].uais;

                              return (
                                <Table.Row key={key}>
                                  <Table.Col>
                                    <div>{key}</div>
                                    <div className="value">{uais.valides} valides</div>
                                  </Table.Col>
                                  <Table.Col>
                                    <Percentage total={uais.valides} value={uais.uniques} />
                                  </Table.Col>
                                  <Table.Col>
                                    <Percentage total={uais.valides} value={uais["dupliqués"]} />
                                  </Table.Col>
                                </Table.Row>
                              );
                            })}
                        </Table.Body>
                      </FixedTable>
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col width={7}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Validité des sirets</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <FixedTable>
                        <Table.Header>
                          <Table.ColHeader>Source</Table.ColHeader>
                          <Table.ColHeader>Valides</Table.ColHeader>
                          <Table.ColHeader>Invalides</Table.ColHeader>
                          <Table.ColHeader>Absents</Table.ColHeader>
                        </Table.Header>
                        <Table.Body>
                          {Object.keys(validation)
                            .sort()
                            .map((key) => {
                              let { total, sirets } = validation[key];

                              return (
                                <Table.Row key={key}>
                                  <Table.Col>
                                    <div>{key}</div>
                                    <div className="value">{total}</div>
                                  </Table.Col>
                                  <Table.Col>
                                    <Percentage
                                      total={total}
                                      value={sirets.actifs + sirets["fermés"]}
                                      details={() =>
                                        `${sirets.actifs + sirets["fermés"]} dont ${sirets["fermés"]} fermés `
                                      }
                                    />
                                  </Table.Col>
                                  <Table.Col>
                                    <Percentage total={total} value={sirets.invalides} />
                                  </Table.Col>
                                  <Table.Col>
                                    <Percentage total={total} value={sirets.absents} />
                                  </Table.Col>
                                </Table.Row>
                              );
                            })}
                        </Table.Body>
                      </FixedTable>
                    </Card.Body>
                  </Card>
                </Grid.Col>
                <Grid.Col width={5}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Unicité des sirets valides</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <FixedTable>
                        <Table.Header>
                          <Table.ColHeader>Source</Table.ColHeader>
                          <Table.ColHeader>Uniques</Table.ColHeader>
                          <Table.ColHeader>Dupliqués</Table.ColHeader>
                        </Table.Header>
                        <Table.Body>
                          {Object.keys(validation)
                            .sort()
                            .map((key) => {
                              let sirets = validation[key].sirets;
                              let total = sirets.actifs + sirets.fermés;

                              return (
                                <Table.Row key={key}>
                                  <Table.Col>
                                    <div>{key}</div>
                                    <div className="value">{total}</div>
                                  </Table.Col>
                                  <Table.Col>
                                    <Percentage total={total} value={sirets.uniques} />
                                  </Table.Col>
                                  <Table.Col>
                                    <Percentage total={total} value={sirets["dupliqués"]} />
                                  </Table.Col>
                                </Table.Row>
                              );
                            })}
                        </Table.Body>
                      </FixedTable>
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </Grid.Row>
            </>
          )}
          {recoupements && matrices && (
            <>
              <h2>Recoupement des uais</h2>
              <Recoupement recoupement={recoupements.uais} />
              <Grid.Row>
                <Grid.Col>
                  <Card>
                    <Card.Header>
                      <Card.Title>Recoupement par source</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Matrice matrice={matrices["uais"]} />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </Grid.Row>
              <h2>Recoupement des sirets</h2>
              <Recoupement recoupement={recoupements.sirets} />
              <Grid.Row>
                <Grid.Col>
                  <Card>
                    <Card.Header>
                      <Card.Title>Recoupement par source</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Matrice matrice={matrices["sirets"]} />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </Grid.Row>
              <h2>Recoupement des sirens</h2>
              <Recoupement recoupement={recoupements.sirens} />
              <Grid.Row>
                <Grid.Col>
                  <Card>
                    <Card.Header>
                      <Card.Title>Recoupement par source</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Matrice matrice={matrices["sirens"]} />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </Grid.Row>
              <h2>Recoupement des uais-sirets</h2>
              <Recoupement recoupement={recoupements.uais_sirets} />
              <Grid.Row>
                <Grid.Col>
                  <Card>
                    <Card.Header>
                      <Card.Title>Recoupement par source</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Matrice matrice={matrices["uais_sirets"]} />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </Grid.Row>
              <h2>Recoupement des uais-sirens</h2>
              <Recoupement recoupement={recoupements.uais_sirens} />
              <Grid.Row>
                <Grid.Col>
                  <Card>
                    <Card.Header>
                      <Card.Title>Recoupement par source</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Matrice matrice={matrices["uais_sirens"]} />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </Grid.Row>
            </>
          )}
        </Page.Content>
      </Page.Main>
    </Page>
  );
}
