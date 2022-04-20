import http from 'k6/http';
import { sleep } from 'k6';
import { SharedArray } from 'k6/data';

const data = new SharedArray('search params', function () {
  return [
    {
      "uais": "0810833R"
    },
    {
      "uais": "0922969C"
    },
    {
      "uais": true
    },
    {
      "uais": false
    },
    {
      "numero_declaration_activite": true
    },
    {
      "numero_declaration_activite": false
    },
    {
      "qualiopi": true
    },
    {
      "qualiopi": false
    },
    {
      "uai_potentiels": true
    },
    {
      "uai_potentiels": false
    },
    {
      "etat_administratif": "actif"
    },
    {
      "etat_administratif": "fermé"
    },
    {
      "sirets": "19592712400014"
    },
    {
      "sirets": "19590102000014"
    },
  ];
});

function asQueryString(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export const options = {
    discardResponseBodies: true,
    scenarios: {
      stress: {
        executor: "ramping-arrival-rate",
        startRate: 500,
        timeUnit: "1m",
        preAllocatedVUs: 2,
        maxVUs: 50,
        stages: [
          { target: 1000, duration: "1m" },
          { target: 2000, duration: "1m" },
          { target: 3000, duration: "1m" },
          { target: 4000, duration: "1m" },
        ],
      },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
  },
  };


export default function () {
  let params = data[Math.floor(Math.random() * data.length)]
  http.get(`https://referentiel-recette.apprentissage.beta.gouv.fr/api/v1/organismes?${asQueryString(params)}`);
  sleep(1);
}

