import { sortBy } from "lodash-es";

const MAPPER = {
  actif: { label: "En activité", color: "#0f9d58", order: 0 },
  fermé: { label: "Fermé", color: "#e1000f", order: 1 },
};

export const getEtatAdministratifKeys = () => sortBy(Object.keys(MAPPER), (key) => MAPPER[key].order);
export const getEtatAdministratifLabel = (key) => MAPPER[key].label;
export const getEtatAdministratifColor = (key) => MAPPER[key].color;
