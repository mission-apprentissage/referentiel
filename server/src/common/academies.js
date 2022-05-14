const ACADEMIES = [
  { code: "00", nom: "Étranger", departements: [{ code: "984", nom: "Terres australes et antarctiques françaises" }] },
  { code: "01", nom: "Paris", departements: [{ code: "75", nom: "Paris" }] },
  {
    code: "02",
    nom: "Aix-Marseille",
    departements: [
      { code: "84", nom: "Vaucluse" },
      { code: "04", nom: "Alpes-de-Haute-Provence" },
      { code: "05", nom: "Hautes-Alpes" },
      { code: "13", nom: "Bouches-du-Rhône" },
    ],
  },
  {
    code: "03",
    nom: "Besançon",
    departements: [
      { code: "70", nom: "Haute-Saône" },
      { code: "90", nom: "Territoire de Belfort" },
      { code: "39", nom: "Jura" },
      { code: "25", nom: "Doubs" },
    ],
  },
  {
    code: "04",
    nom: "Bordeaux",
    departements: [
      { code: "33", nom: "Gironde" },
      { code: "40", nom: "Landes" },
      { code: "47", nom: "Lot-et-Garonne" },
      { code: "24", nom: "Dordogne" },
      { code: "64", nom: "Pyrénées-Atlantiques" },
    ],
  },
  {
    code: "06",
    nom: "Clermont-Ferrand",
    departements: [
      { code: "43", nom: "Haute-Loire" },
      { code: "03", nom: "Allier" },
      { code: "15", nom: "Cantal" },
      { code: "63", nom: "Puy-de-Dôme" },
    ],
  },
  {
    code: "07",
    nom: "Dijon",
    departements: [
      { code: "71", nom: "Saône-et-Loire" },
      { code: "89", nom: "Yonne" },
      { code: "21", nom: "Côte-d'Or" },
      { code: "58", nom: "Nièvre" },
    ],
  },
  {
    code: "08",
    nom: "Grenoble",
    departements: [
      { code: "73", nom: "Savoie" },
      { code: "74", nom: "Haute-Savoie" },
      { code: "26", nom: "Drôme" },
      { code: "38", nom: "Isère" },
      { code: "07", nom: "Ardèche" },
    ],
  },
  {
    code: "09",
    nom: "Lille",
    departements: [
      { code: "59", nom: "Nord" },
      { code: "62", nom: "Pas-de-Calais" },
    ],
  },
  {
    code: "10",
    nom: "Lyon",
    departements: [
      { code: "42", nom: "Loire" },
      { code: "01", nom: "Ain" },
      { code: "69", nom: "Rhône" },
    ],
  },
  {
    code: "11",
    nom: "Montpellier",
    departements: [
      { code: "30", nom: "Gard" },
      { code: "34", nom: "Hérault" },
      { code: "48", nom: "Lozère" },
      { code: "11", nom: "Aude" },
      { code: "66", nom: "Pyrénées-Orientales" },
    ],
  },
  {
    code: "12",
    nom: "Nancy-Metz",
    departements: [
      { code: "88", nom: "Vosges" },
      { code: "54", nom: "Meurthe-et-Moselle" },
      { code: "55", nom: "Meuse" },
      { code: "57", nom: "Moselle" },
    ],
  },
  {
    code: "13",
    nom: "Poitiers",
    departements: [
      { code: "79", nom: "Deux-Sèvres" },
      { code: "86", nom: "Vienne" },
      { code: "16", nom: "Charente" },
      { code: "17", nom: "Charente-Maritime" },
    ],
  },
  {
    code: "14",
    nom: "Rennes",
    departements: [
      { code: "29", nom: "Finistère" },
      { code: "35", nom: "Ille-et-Vilaine" },
      { code: "22", nom: "Côtes-d'Armor" },
      { code: "56", nom: "Morbihan" },
    ],
  },
  {
    code: "15",
    nom: "Strasbourg",
    departements: [
      { code: "67", nom: "Bas-Rhin" },
      { code: "68", nom: "Haut-Rhin" },
    ],
  },
  {
    code: "16",
    nom: "Toulouse",
    departements: [
      { code: "81", nom: "Tarn" },
      { code: "82", nom: "Tarn-et-Garonne" },
      { code: "31", nom: "Haute-Garonne" },
      { code: "32", nom: "Gers" },
      { code: "46", nom: "Lot" },
      { code: "09", nom: "Ariège" },
      { code: "12", nom: "Aveyron" },
      { code: "65", nom: "Hautes-Pyrénées" },
    ],
  },
  {
    code: "17",
    nom: "Nantes",
    departements: [
      { code: "72", nom: "Sarthe" },
      { code: "85", nom: "Vendée" },
      { code: "44", nom: "Loire-Atlantique" },
      { code: "49", nom: "Maine-et-Loire" },
      { code: "53", nom: "Mayenne" },
    ],
  },
  {
    code: "18",
    nom: "Orléans-Tours",
    departements: [
      { code: "28", nom: "Eure-et-Loir" },
      { code: "36", nom: "Indre" },
      { code: "37", nom: "Indre-et-Loire" },
      { code: "41", nom: "Loir-et-Cher" },
      { code: "45", nom: "Loiret" },
      { code: "18", nom: "Cher" },
    ],
  },
  {
    code: "19",
    nom: "Reims",
    departements: [
      { code: "08", nom: "Ardennes" },
      { code: "10", nom: "Aube" },
      { code: "51", nom: "Marne" },
      { code: "52", nom: "Haute-Marne" },
    ],
  },
  {
    code: "20",
    nom: "Amiens",
    departements: [
      { code: "80", nom: "Somme" },
      { code: "02", nom: "Aisne" },
      { code: "60", nom: "Oise" },
    ],
  },
  {
    code: "22",
    nom: "Limoges",
    departements: [
      { code: "87", nom: "Haute-Vienne" },
      { code: "19", nom: "Corrèze" },
      { code: "23", nom: "Creuse" },
    ],
  },
  {
    code: "23",
    nom: "Nice",
    departements: [
      { code: "83", nom: "Var" },
      { code: "06", nom: "Alpes-Maritimes" },
    ],
  },
  {
    code: "24",
    nom: "Créteil",
    departements: [
      { code: "77", nom: "Seine-et-Marne" },
      { code: "93", nom: "Seine-Saint-Denis" },
      { code: "94", nom: "Val-de-Marne" },
    ],
  },
  {
    code: "25",
    nom: "Versailles",
    departements: [
      { code: "78", nom: "Yvelines" },
      { code: "91", nom: "Essonne" },
      { code: "92", nom: "Hauts-de-Seine" },
      { code: "95", nom: "Val-d'Oise" },
    ],
  },
  {
    code: "27",
    nom: "Corse",
    departements: [
      { code: "20", nom: "Corse" },
      { code: "2A", nom: "Corse-du-Sud" },
      { code: "2B", nom: "Haute-Corse" },
    ],
  },
  { code: "28", nom: "La Réunion", departements: [{ code: "974", nom: "La Réunion" }] },
  { code: "31", nom: "Martinique", departements: [{ code: "972", nom: "Martinique" }] },
  { code: "32", nom: "Guadeloupe", departements: [{ code: "971", nom: "Guadeloupe" }] },
  { code: "33", nom: "Guyane", departements: [{ code: "973", nom: "Guyane" }] },
  { code: "40", nom: "Nouvelle-Calédonie", departements: [{ code: "988", nom: "Nouvelle-Calédonie" }] },
  {
    code: "41",
    nom: "Polynésie Française",
    departements: [
      { code: "987", nom: "Polynésie Française" },
      { code: "989", nom: "Île de Clipperton" },
    ],
  },
  { code: "42", nom: "Wallis et Futuna", departements: [{ code: "986", nom: "Wallis et Futuna" }] },
  { code: "43", nom: "Mayotte", departements: [{ code: "976", nom: "Mayotte" }] },
  { code: "44", nom: "Saint-Pierre-et-Miquelon", departements: [{ code: "975", nom: "Saint-Pierre-et-Miquelon" }] },
  {
    code: "70",
    nom: "Normandie",
    departements: [
      { code: "76", nom: "Seine-Maritime" },
      { code: "27", nom: "Eure" },
      { code: "50", nom: "Manche" },
      { code: "14", nom: "Calvados" },
      { code: "61", nom: "Orne" },
    ],
  },
  { code: "77", nom: "Saint-Barthélemy", departements: [{ code: "977", nom: "Saint-Barthélemy" }] },
  { code: "78", nom: "Saint-Martin", departements: [{ code: "978", nom: "Saint-Martin" }] },
];

function findAcademieByName(name) {
  return ACADEMIES.find((academie) => academie.nom === name) || null;
}

function findAcademieByCode(code) {
  return ACADEMIES.find((academie) => academie.code === code) || null;
}

function findAcademieByCodeInsee(code) {
  return ACADEMIES.find((academie) => academie.departements.find((d) => code.startsWith(d.code))) || null;
}

function findAcademieByUai(uai) {
  if (!uai) {
    return null;
  }

  const metropole = ["0", "6", "7"].includes(uai.substring(0, 1));
  const found = ACADEMIES.find((academie) => {
    const code = metropole ? uai.substring(1, 3) : uai.substring(0, 3);
    return academie.departements.map((d) => d.code).includes(code);
  });

  return found || null;
}

function getAcademies() {
  return ACADEMIES;
}

module.exports = {
  findAcademieByName,
  findAcademieByCode,
  findAcademieByUai,
  findAcademieByCodeInsee,
  getAcademies,
};
