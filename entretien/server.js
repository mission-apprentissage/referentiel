const axios = require("axios");
const https = require("https");
const express = require("express");

(async function () {
  const app = express();

  app.get("/data", async (req, res) => {
    let organismes = getData1();
    const formations = await getData2();
    let apprentis = null;
    getData3((data) => {
      apprentis = data;
    });

    return res.json({
      organismes,
      formations: formations,
      apprentis,
    });
  });

  app.listen(5000, () => console.log(`Server ready and listening on port ${5000}`));
})();

async function getData1() {
  let response = await axios.get("https://mocki.io/v1/5189bd14-deec-4b16-9b67-eaddae83dac7");
  let organismes = response.data;

  for (let i = 0; i < organismes.length; i++) {
    organismes[i].nom = organismes[i].raison_sociale;
    delete organismes[i].raison_sociale;
  }

  return organismes;
}

async function getData2() {
  try {
    return axios.get("https://mocki.io/v1/f9fc90bc-3406-4f53-91c9-286adaf616b7").then((response) => response.data);
  } catch (e) {
    console.error(e);
  }
}

const getData3 = (callback) => {
  https
    .get("https://mocki.io/v1/f88279b4-d1a8-4cba-8fe3-7bd79baeb4d6", (resp) => {
      let data = "";

      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", () => {
        return callback(data);
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
};
