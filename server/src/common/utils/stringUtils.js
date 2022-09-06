function encodeToBase64(string) {
  return Buffer.from(string).toString("base64");
}

function asSiren(siret) {
  return siret.substring(0, 9);
}

module.exports = {
  encodeToBase64,
  asSiren,
};
