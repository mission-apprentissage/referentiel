const { oleoduc } = require("oleoduc");

function sendHTML(html, res) {
  res.set("Content-Type", "text/html");
  res.send(Buffer.from(html));
}

function sendJsonStream(stream, res) {
  res.setHeader("Content-Type", "application/json");
  oleoduc(stream, res);
}

module.exports = {
  sendHTML,
  sendJsonStream,
};
