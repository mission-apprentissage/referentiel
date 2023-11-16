const assert = require("assert");
const sinon = require("sinon");
const crypto = require("crypto");
const { addUser } = require("../../../src/common/actions/addUser");

describe("addUser", function () {
  let pbkdf2Stub;

  const email = "test@example.com";
  const password = "password123";
  const type = "user";
  const code = "code123";

  afterEach(() => {
    sinon.restore();
  });

  it("should hash password and store user details", async () => {
    pbkdf2Stub = sinon.stub(crypto, "pbkdf2").yields(null, Buffer.from("encryptedPassword"));

    const createdUser = await addUser(email, password, type, code);

    sinon.assert.calledWith(pbkdf2Stub, password, sinon.match.string, 310000, 32, "sha256");
    assert.strictEqual(createdUser.acknowledged, true, "User creation not acknowledged as expected");
  });

  it("should fail if there is an error while deriving key", async () => {
    pbkdf2Stub = sinon.stub(crypto, "pbkdf2").yields(new Error("Error while deriving key"));

    try {
      await addUser(email, password, type, code);
      assert.fail("Expected error was not thrown");
    } catch (error) {
      assert.strictEqual(error.message, "Error while deriving key");
    }

    sinon.assert.calledWith(pbkdf2Stub, password, sinon.match.string, 310000, 32, "sha256");
  });
});
