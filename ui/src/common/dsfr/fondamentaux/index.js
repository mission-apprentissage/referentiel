import { buildComponent } from '../dsfr';


export const Container = buildComponent('div', 'fr-container');
export const GridRow = buildComponent('div', 'fr-grid-row');
export const Col = buildComponent('div', 'fr-col', { bemDelimiter: '-' });
