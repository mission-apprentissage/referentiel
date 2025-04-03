import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import jwt from "jsonwebtoken";
import { ApiContext } from "./common/ApiProvider.jsx";
import { UserContext } from "./common/UserProvider.jsx";
import Alert from "./common/dsfr/elements/Alert.jsx";

export default function Connexion() {
  const { httpClient } = useContext(ApiContext);
  const [userContext, setUserContext] = useContext(UserContext);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    if (username === "") {
      setUsernameError(true);
    }
    if (password === "") {
      setPasswordError(true);
    }

    if (!usernameError && !passwordError) {
      const result = await httpClient._post("/api/v1/users/login", { email: username, password });
      if (result.success && result.token) {
        const decodedToken = jwt.decode(result.token);
        setUserContext({
          code: decodedToken.code,
          email: decodedToken.email,
          nom: decodedToken.nom,
          type: decodedToken.type,
          token: result.token,
          loading: false,
          isAnonymous: false,
          isAdmin: decodedToken.isAdmin,
        });
        navigate("/tableau-de-bord");
      } else {
        setLoginError(result.message);
      }
    }
  };

  if (!userContext.loading && userContext.token) return <Navigate to="/tableau-de-bord" />;

  return (
    <>
      {loginError && (
        <Alert modifiers={"error"} title={"Une erreur est survenue"}>
          {loginError}
          <p>
            Contacter l’équipe du Référentiel :{" "}
            <a href="mailto:referentiel-uai-siret@onisep.fr">referentiel-uai-siret@onisep.fr</a>
          </p>
        </Alert>
      )}
      <main className="fr-pt-md-14v" role="main" id="content">
        <div className="fr-container fr-container--fluid fr-mb-md-14v">
          <div className="fr-grid-row fr-grid-row-gutters fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
              <div className="fr-container fr-background-alt--grey fr-px-md-0 fr-py-10v fr-py-md-14v">
                <div className="fr-grid-row fr-grid-row-gutters fr-grid-row--center">
                  <div className="fr-col-12 fr-col-md-9 fr-col-lg-8">
                    <h1>Espace de fiabilisation des académies</h1>
                    <p>
                      L’espace de fiabilisation des couples UAI-SIRET est réservé aux académies (SSA) et aux référents
                      mandatés pour faire cette expertise.
                      <br />
                      Pour toutes informations :{" "}
                      <a href="referentiel-uai-siret@onisep.fr">referentiel-uai-siret@onisep.fr</a>
                    </p>
                    <div>
                      <form id="login-1760" onSubmit={handleLogin}>
                        <fieldset
                          className="fr-fieldset"
                          id="login-1760-fieldset"
                          aria-labelledby="login-1760-fieldset-legend login-1760-fieldset-messages"
                        >
                          <div className="fr-fieldset__element">
                            <fieldset className="fr-fieldset" id="credentials" aria-labelledby="credentials-messages">
                              <div className="fr-fieldset__element">
                                <div
                                  className={usernameError ? "fr-input-group fr-input-group--error" : "fr-input-group"}
                                >
                                  <label className="fr-label" htmlFor="username-1757">
                                    Adresse email
                                  </label>
                                  <input
                                    className={usernameError ? "fr-input fr-input--error" : "fr-input"}
                                    autoComplete="username"
                                    aria-required="true"
                                    aria-describedby="username-1757-messages"
                                    name="username"
                                    id="username-1757"
                                    type="email"
                                  />
                                  {usernameError && (
                                    <p id="text-input-error-desc-error" className="fr-error-text">
                                      Ce champ est obligatoire
                                    </p>
                                  )}
                                </div>
                              </div>
                              <br />
                              <div className="fr-fieldset__element">
                                <div className="fr-password" id="password-1758">
                                  <label
                                    className={passwordError ? "fr-label--error" : "fr-label"}
                                    htmlFor="password-1758-input"
                                  >
                                    Mot de passe
                                  </label>
                                  <div className="fr-input-wrap">
                                    <input
                                      className={
                                        passwordError
                                          ? "fr-password__input fr-input fr-input--error"
                                          : "fr-password__input fr-input"
                                      }
                                      aria-describedby="password-1758-input-messages"
                                      aria-required="true"
                                      name="password"
                                      autoComplete="current-password"
                                      id="password-1758-input"
                                      type="password"
                                    />
                                  </div>
                                  {passwordError && (
                                    <p id="text-input-error-desc-error" className="fr-error-text">
                                      Ce champ est obligatoire
                                    </p>
                                  )}
                                </div>
                              </div>
                            </fieldset>
                          </div>
                          <br />
                          <br />
                          <div className="fr-fieldset__element">
                            <ul className="fr-btns-group">
                              <li>
                                <button className="fr-mt-2v fr-btn">Se connecter</button>
                              </li>
                            </ul>
                          </div>
                          <div
                            className="fr-messages-group"
                            id="login-1760-fieldset-messages"
                            aria-live="assertive"
                          ></div>
                        </fieldset>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
