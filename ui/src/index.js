import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import GridDisplayer from "./common/dsfr/GridDisplayer";
import { bootstrapDsfr } from "./common/dsfr/dsfr";

ReactDOM.render(
  <React.StrictMode>
    <GridDisplayer />
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
  () => bootstrapDsfr()
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
