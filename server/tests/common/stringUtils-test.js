const assert = require("assert");
const { encodeToBase64, asSiren } = require("../../src/common/utils/stringUtils.js");

describe("stringUtils", () => {
  it("permet d'encoder une string en base 64", () => {
    assert.strictEqual(encodeToBase64("test"), "dGVzdA==");
  });

  it("permet d'obtenir le siren pour un siret", () => {
    assert.strictEqual(asSiren("11111111100000"), "111111111");
  });
});
