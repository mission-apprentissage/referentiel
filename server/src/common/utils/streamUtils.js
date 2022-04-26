const { compose, transformData } = require("oleoduc");
const Pick = require("stream-json/filters/Pick");
const { streamArray } = require("stream-json/streamers/StreamArray");

module.exports = {
  streamNestedJsonArray: (arrayPropertyName) => {
    return compose(
      Pick.withParser({ filter: arrayPropertyName }),
      streamArray(),
      transformData((data) => data.value)
    );
  },
};
