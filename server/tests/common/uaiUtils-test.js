const assert = require("assert");
const { isUAIValid } = require("../../src/common/utils/uaiUtils");

describe("uaiUtils", () => {
  it("permet de valider un UAI", () => {
    assert.strictEqual(isUAIValid("0010856A"), true);
    assert.strictEqual(isUAIValid("0000856A"), false);
    assert.strictEqual(isUAIValid("0010856B"), false);
    assert.strictEqual(isUAIValid("00108"), false);
    assert.strictEqual(isUAIValid(null), false);
    assert.strictEqual(isUAIValid(undefined), false);
    assert.strictEqual(isUAIValid(""), false);
  });
});
