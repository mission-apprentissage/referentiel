import { sortBy } from "lodash-es";

const MAPPER = {
  actif: { label: "En activité", color: "#56C8B6", order: 0 },
  fermé: { label: "Fermé", color: "#568D88", order: 1 },
};

export const getEtatAdministratifTypes = () => sortBy(Object.keys(MAPPER), (key) => MAPPER[key].order);
export const getEtatAdministratifLabel = (key) => MAPPER[key].label;
export const getEtatAdministratifColor = (key) => MAPPER[key].color;
