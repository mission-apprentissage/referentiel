window.dsfr = {
  verbose: true,
  mode: "manual",
};
require("@gouvfr/dsfr/dist/dsfr/dsfr.module");
require("@gouvfr/dsfr/dist/dsfr/dsfr.nomodule");

const api = {
  bootstrap: () => setTimeout(() => dsfr.start(), 250),
};

export default api;
