const { compose, transformData } = require("oleoduc");
const Pick = require("stream-json/filters/Pick");
const { parser: jsonParser } = require("stream-json");
const { streamArray } = require("stream-json/streamers/StreamArray");
const { PassThrough, Transform } = require("stream");

function transformStream(transform, options = {}) {
  return new Transform({
    objectMode: true,
    ...options,
    transform: function (chunk, encoding, callback) {
      transform(chunk)
        .then((stream) => {
          stream.once("end", callback);
          return this.push(stream);
        })
        .catch(callback);
    },
  });
}

function concatStreams(next) {
  const passThrough = new PassThrough({ objectMode: true });
  passThrough.setMaxListeners(0);

  async function concat() {
    const stream = await next();
    if (!stream) {
      return passThrough.end();
    }

    stream.on("error", (e) => passThrough.emit("error", e));
    stream.on("end", () => concat());
    stream.pipe(passThrough, { end: false });
  }

  concat();

  return passThrough;
}

function streamJsonArray() {
  return compose(
    jsonParser(),
    streamArray(),
    transformData((data) => data.value)
  );
}

function streamNestedJsonArray(arrayPropertyName) {
  return compose(
    Pick.withParser({ filter: arrayPropertyName }),
    streamArray(),
    transformData((data) => data.value)
  );
}

module.exports = {
  transformStream,
  streamNestedJsonArray,
  streamJsonArray,
  concatStreams,
};
