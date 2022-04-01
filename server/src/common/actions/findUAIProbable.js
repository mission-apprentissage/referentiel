function findUAIProbable(organisme) {
  let potentiels = organisme.uai_potentiels.filter((item) => {
    let sources = item.sources.filter((s) => s.includes("sifa-ramsese") || s.includes("catalogue-etablissements"));
    return sources.length >= 1;
  });

  if (potentiels.length === 0) {
    return null;
  }

  return potentiels.reduce((acc, u) => (acc.sources.length < u.sources.length ? u : acc));
}

module.exports = findUAIProbable;
