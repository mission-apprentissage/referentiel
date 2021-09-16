const assert = require("assert");
const { validateUAI } = require("../../src/common/utils/uaiUtils");

describe(__filename, () => {
  it("permet de valider un UAI", () => {
    assert.strictEqual(validateUAI("0010856A"), true);
    assert.strictEqual(validateUAI("0000856A"), false);
    assert.strictEqual(validateUAI("0010856B"), false);
    assert.strictEqual(validateUAI("00108"), false);
    assert.strictEqual(validateUAI(null), false);
    assert.strictEqual(validateUAI(undefined), false);
    assert.strictEqual(validateUAI(""), false);
  });
});
