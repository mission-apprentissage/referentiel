import { sortBy } from 'lodash-es';

const MAPPER = {
  qualiopi: { label: 'Qualiopi', color: '#568D88', order: 0, params: { qualiopi: true } },
  non_qualiopi: { label: 'Non Qualiopi', color: '#56C8B6', order: 1, params: { qualiopi: false } },
};

export const getQualiopiTypes = () => sortBy(Object.keys(MAPPER), (key) => MAPPER[key].order);
export const getQualiopiLabel = (key) => MAPPER[key].label;
export const getQualiopiColor = (key) => MAPPER[key].color;
export const getQualiopiParams = (key) => MAPPER[key].params;
