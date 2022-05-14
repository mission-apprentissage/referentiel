const { object, objectId, string, boolean, number, date } = require("./schemas/jsonSchemaTypes");

module.exports = {
  name: "datagouv",
  schema: () => {
    const required = ["numeroDeclarationActivite"];

    return object(
      {
        _id: objectId(),
        numeroDeclarationActivite: string(),
        numerosDeclarationActivitePrecedent: string(),
        denomination: string(),
        siren: string(),
        siretEtablissementDeclarant: string(),
        adressePhysiqueOrganismeFormation: object({
          voie: string(),
          codePostal: string(),
          ville: string(),
          codeRegion: string(),
        }),
        certifications: object({
          actionsDeFormation: boolean(),
          bilansDeCompetences: boolean(),
          VAE: string(),
          actionsDeFormationParApprentissage: boolean(),
        }),
        organismeEtrangerRepresente: object({
          denomination: string(),
          voie: string(),
          codePostal: string(),
          ville: string(),
          pays: string(),
        }),
        informationsDeclarees: object({
          dateDerniereDeclaration: date(),
          debutExercice: date(),
          finExercice: date(),
          nbStagiaires: number(),
          nbStagiairesConfiesParUnAutreOF: number(),
          effectifFormateurs: number(),
          specialitesDeFormation: object({
            codeSpecialite1: string(),
            libelleSpecialite1: string(),
            codeSpecialite2: string(),
            libelleSpecialite2: string(),
            codeSpecialite3: string(),
            libelleSpecialite3: string(),
          }),
        }),
      },
      { required }
    );
  },
  indexes: () => {
    return [[{ numeroDeclarationActivite: 1 }, { unique: true }], [{ siretEtablissementDeclarant: 1 }]];
  },
};
