import { sortBy } from "lodash-es";

const MAPPER = {
  responsable: { label: "Responsable", color: "#B4C8FB", order: 0, params: { natures: "responsable" } },
  formateur: { label: "Formateur", color: "#417DC4", order: 2, params: { natures: "formateur" } },
  inconnue: { label: "Nature inconnue", color: "#2E4C8C", order: 3, params: { natures: "inconnue" } },
  responsable_formateur: {
    label: "Responsable et formateur",
    color: "#88ABF8",
    order: 1,
    params: { natures: "responsable_formateur" },
  },
};

export const getNatureTypes = () => sortBy(Object.keys(MAPPER), (key) => MAPPER[key].order);
export const getNatureLabel = (id) => MAPPER[id].label;
export const getNatureColor = (id) => MAPPER[id].color;
export const getNatureParams = (key) => MAPPER[key].params;
