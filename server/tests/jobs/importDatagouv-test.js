const { omit } = require("lodash");
const assert = require("assert");
const { createStream } = require("../utils/testUtils");
const importDatagouv = require("../../src/jobs/importDatagouv");
const { dbCollection } = require("../../src/common/db/mongodb");

let getDatagouvFile = (content) => {
  return createStream(
    content ||
      `numeroDeclarationActivite;numerosDeclarationActivitePrecedent;denomination;siren;siretEtablissementDeclarant;adressePhysiqueOrganismeFormation.voie;adressePhysiqueOrganismeFormation.codePostal;adressePhysiqueOrganismeFormation.ville;adressePhysiqueOrganismeFormation.codeRegion;certifications.actionsDeFormation;certifications.bilansDeCompetences;certifications.VAE;certifications.actionsDeFormationParApprentissage;organismeEtrangerRepresente.denomination;organismeEtrangerRepresente.voie;organismeEtrangerRepresente.codePostal;organismeEtrangerRepresente.ville;organismeEtrangerRepresente.pays;informationsDeclarees.dateDerniereDeclaration;informationsDeclarees.debutExercice;informationsDeclarees.finExercice;informationsDeclarees.specialitesDeFormation.codeSpecialite1;informationsDeclarees.specialitesDeFormation.libelleSpecialite1;informationsDeclarees.specialitesDeFormation.codeSpecialite2;informationsDeclarees.specialitesDeFormation.libelleSpecialite2;informationsDeclarees.specialitesDeFormation.codeSpecialite3;informationsDeclarees.specialitesDeFormation.libelleSpecialite3;informationsDeclarees.nbStagiaires;informationsDeclarees.nbStagiairesConfiesParUnAutreOF;informationsDeclarees.effectifFormateurs;
"12345678900";"12345678901";"OF";"111111111";"1111111110001";"";"";"";"11";true;false;false;false;;"";"";"";"";03/12/2020;01/11/2020;31/12/2021;"312";"Commerce, vente";;;;;;;0;
`
  );
};

describe("importDatagouv", () => {
  it("Vérifie qu'on peut importer les organismes de formations", async () => {
    let stats = await importDatagouv({
      input: getDatagouvFile(),
    });

    assert.deepStrictEqual(stats, { total: 1, created: 1, updated: 0, failed: 0 });
    const results = await dbCollection("datagouv").find().toArray();
    assert.strictEqual(results.length, 1);
    assert.deepStrictEqual(omit(results[0], ["_id"]), {
      adressePhysiqueOrganismeFormation: {
        codeRegion: "11",
      },
      certifications: {
        VAE: "false",
        actionsDeFormation: true,
        actionsDeFormationParApprentissage: false,
        bilansDeCompetences: false,
      },
      denomination: "OF",
      informationsDeclarees: {
        dateDerniereDeclaration: new Date("2020-12-03T00:00:00.000Z"),
        debutExercice: new Date("2020-11-01T00:00:00.000Z"),
        finExercice: new Date("2021-12-31T00:00:00.000Z"),
        effectifFormateurs: 0,
        specialitesDeFormation: {
          codeSpecialite1: "312",
          libelleSpecialite1: "Commerce, vente",
        },
      },
      numeroDeclarationActivite: "12345678900",
      numerosDeclarationActivitePrecedent: "12345678900",
      organismeEtrangerRepresente: {},
      siren: "111111111",
      siretEtablissementDeclarant: "1111111110001",
    });
  });
});
