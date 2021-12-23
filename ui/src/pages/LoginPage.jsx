import { Navigate } from "react-router-dom";
import useNavigation from "../common/navigation/useNavigation";
import { isAnonymous, setAuth } from "../common/api/auth";
import Alert from "../common/dsfr/elements/Alert";
import { Col, Container, GridRow } from "../common/dsfr/fondamentaux";

export default function Login() {
  let { params } = useNavigation();
  if (params.token) {
    setAuth(params.token);
  }

  if (isAnonymous() && !params.token) {
    return (
      <Container>
        <GridRow className={"fr-mb-10w"}>
          <Col>
            <Alert modifiers={"info"}>
              Pour vous connecter à l'application, veuillez utiliser le lien qui vous a été communiqué.
            </Alert>
          </Col>
        </GridRow>
      </Container>
    );
  }

  return <Navigate to="/" replace={true} />;
}
