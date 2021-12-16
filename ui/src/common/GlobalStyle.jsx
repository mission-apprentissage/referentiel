import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --background-validation-A_VALIDER: #FEF5E8;
    --background-validation-INCONNUE: #FEF4F2;
    --background-validation-VALIDEE: #E3FDEB;
    --background-box: #F9F8F6;
    --background-box-light: rgba(249, 248, 246, .4);
    --background-box-hover: var(--background-contrast-grey);
  }
`;

export default GlobalStyle;
