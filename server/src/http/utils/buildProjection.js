function buildProjection(fields) {
  return fields.reduce((acc, field) => {
    return { ...acc, [field]: 1 };
  }, {});
}

module.exports = buildProjection;
