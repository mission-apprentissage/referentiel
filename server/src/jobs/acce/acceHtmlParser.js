const moment = require("moment");
const { omitBy, isNull } = require("lodash");
const { JSDOM } = require("jsdom");

function parseDate(value) {
  if (!value) {
    return null;
  }
  return new Date(moment(value, "DD/MM/YYYY").format("YYYY-MM-DD") + "Z");
}

function sanitize(txt) {
  return txt
    .toLowerCase()
    .replace(/d'/g, "")
    .replace(/l'/g, "")
    .replace(/d’/g, "")
    .replace(/l’/g, "")
    .replace(/'/g, "")
    .replace(/,/g, "")
    .replace(/n°/g, "")
    .trim()
    .replace(/ /g, "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getTableColumnsAsProperties(tableEl) {
  return Array.from(tableEl.querySelectorAll("td")).reduce((acc, el, index, array) => {
    if (index % 2 === 0) {
      const value = array[index + 1];
      acc[sanitize(el.textContent)] = value ? value.textContent : null;
    }
    return acc;
  }, {});
}

function getTableRowsAProperties(tableEl) {
  const keys = Array.from(tableEl.querySelectorAll("thead th")).map((th) => th.textContent);
  return Array.from(tableEl.querySelectorAll("tbody tr")).reduce((acc, tr) => {
    return [
      ...acc,
      Array.from(tr.querySelectorAll("td")).reduce((obj, td, index) => {
        const value = td.textContent;
        const props = {
          ...obj,
          [sanitize(keys[index])]: value ? value.replace(/\n/g, "").trim() : null,
        };

        return omitBy(props, isNull);
      }, {}),
    ];
  }, []);
}

function domify(html) {
  const dom = new JSDOM(html);
  return {
    querySelector: (selector) => dom.window.document.querySelector(selector),
    textContent: (selector) => {
      const selected = dom.window.document.querySelector(selector);
      if (!selected || selected.textContent === "\xa0") {
        return "";
      }

      return selected.textContent
        .replace(/\xa0/g, " ")
        .replace(/[ ]{2,}/g, " ")
        .trim();
    },
  };
}

module.exports = function (html) {
  const { querySelector, textContent } = domify(html);

  return {
    searchPage: {
      getNbResults() {
        return parseInt(textContent("#numfound").replace(/ /g, ""));
      },
    },
    etablissementPage: {
      getForm1Properties() {
        const h1 = textContent(`.form1 .section h1`)
          .split("-")
          .map((v) => v.trim());

        function txt(selector, sanitizer = (v) => v) {
          const content = textContent(selector);
          return content === "" ? null : sanitizer(content);
        }

        const div = ".form1 .section div:nth-of-type";
        return omitBy(
          {
            nom: h1[0],
            uai: h1[h1.length - 1],
            adresse: txt(`${div}(1) span`),
            academie: txt(`${div}(2) span`, (v) => v.replace(/Académie : /g, "")),
            tel: txt(`${div}(3) span.colgauche`, (v) => v.replace(/Tél : /g, "").replace(/ /g, "")),
            fax: txt(`${div}(3) span.coldroite`, (v) => v.replace(/Fax : /g, "").replace(/ /g, "")),
            email: txt(`${div}(4) span`, (v) => v.replace(/Mèl : /g, "")),
            site_web: txt(`${div}(5) span`, (v) => v.replace(/Site WEB : /g, "")),
            maj: txt(`${div}(6) span`, (v) => {
              return parseDate(v.replace(/Données de l’établissement mises à jour le /g, ""));
            }),
            etat: txt(`${div}(8) span.coldebut`, (v) => v.replace(/Etat : /g, "")),
            dateOuverture: txt(`${div}(8) span.colmilieu`, (v) => {
              return parseDate(v.replace(/Date d’ouverture : /g, ""));
            }),
            dateDeFermeture: txt(`${div}(8) span.colfin`, (v) => {
              return parseDate(v.replace(/Date de fermeture : /g, ""));
            }),
            inconnu1: txt(`${div}(8) span.colfin`),
            tutelle: txt(`${div}(9) span.colgauche`, (v) => v.replace(/Tutelle : /g, "")),
            secteur: txt(`${div}(9) span.coldroite`, (v) => v.replace(/Secteur : /g, "")),
            inconnu2: txt(`${div}(10) span.colgauche`),
            contrat: txt(`${div}(10) span.coldroite`),
          },
          isNull
        );
      },
      getForm2Properties() {
        let rubrique;
        let sousRubrique;

        return Array.from(querySelector(".form2 .section").children).reduce((acc, el) => {
          if (el.tagName === "H1") {
            rubrique = sanitize(el.textContent);
            return acc;
          }

          const current = acc[rubrique] || {};

          if (rubrique === "zones") {
            acc[rubrique] = {
              ...current,
              ...getTableColumnsAsProperties(el),
            };
            return acc;
          }

          if (rubrique === "geolocalisation") {
            //ignore the map parsed in getCoordinates()
            return acc;
          }

          if (rubrique === "rattachements") {
            if (el.tagName === "H3") {
              sousRubrique = sanitize(el.textContent);
            } else if (el.tagName === "TABLE") {
              acc[rubrique] = {
                ...current,
                [sousRubrique]: getTableRowsAProperties(el),
              };
            }
            return acc;
          }

          const intro = el.querySelector(".intro");
          if (intro) {
            const key = intro.textContent;
            const value = el.querySelector(".corps").textContent;
            if (!key) {
              //Handle spécificités
              acc[rubrique] = [...(acc[rubrique] || []), ...(value === "Aucune spécificité" ? [] : [value])];
            } else {
              acc[rubrique] = {
                ...current,
                [sanitize(key)]: value,
              };
            }
          }
          return acc;
        }, {});
      },
      getCoordinates() {
        const groups = html.match(/buildStaticMap\(\[(.*)\]/);
        const cache = querySelector(".map img");

        if (groups && groups[1]) {
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: groups[1].split(",").map(parseFloat).reverse(),
            },
          };
        } else if (cache) {
          const coords = cache.src
            .split("/")
            .pop()
            .replace(/_400-400-15.png/g, "")
            .match(/([0-9]+)-([0-9]+)-([-]?[0-9]+)-([0-9]+)/);

          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [parseFloat(`${coords[3]}.${coords[4]}`), parseFloat(`${coords[1]}.${coords[2]}`)],
            },
          };
        }

        return null;
      },
    },
  };
};
