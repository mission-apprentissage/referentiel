import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import GridDisplayer from './common/dsfr/GridDisplayer';
import { bootstrapDsfr } from './common/dsfr/dsfr';
import * as serviceWorker from './serviceWorker';


const container = document.getElementById('root');
const root = createRoot(container);

function Root () {
  useEffect(() => {
    bootstrapDsfr();
  });

  return (
    <StrictMode>
      <GridDisplayer />
      <App />
    </StrictMode>
  );
}

root.render(<Root />);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
