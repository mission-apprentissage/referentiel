function buildProjection(fields) {
  let exclude = false;

  return fields.reduce((acc, field, index) => {
    let key = field;
    if (index === 0 && fields[index].startsWith("-")) {
      exclude = true;
      key = field.substring(1, field.length);
    }
    return { ...acc, [key]: exclude ? 0 : 1 };
  }, {});
}

module.exports = buildProjection;
