import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --color-validation-background-A_VALIDER: var(--yellow-moutarde-975-75);
    --color-validation-background-hover-A_VALIDER: #FEECD3;
    --color-validation-icon-A_VALIDER: var(--yellow-moutarde-main-679);
    --color-validation-background-A_RENSEIGNER: var(--pink-macaron-975-75);
    --color-validation-background-hover-A_RENSEIGNER: #FEE3DD;
    --color-validation-icon-A_RENSEIGNER: var(--pink-tuile-main-556);
    --color-validation-background-VALIDE: var(--green-emeraude-975-75);
    --color-validation-background-hover-VALIDE: #CEFDDC;
    --color-validation-icon-VALIDE: var(--green-emeraude-main-632);


    --color-box-background: #F9F8F6;
    --color-box-background-hover: #E4E3E1;
    --color-box-background-light: rgba(249, 248, 246, .4);
  }
`;

export default GlobalStyle;
