/**
 * Source https://www.insee.fr/fr/information/2028129+&cd=1&hl=fr&ct=clnk&gl=fr
 */
const CATEGORIES = [
  {
    code: "0",
    label: "Organisme de placement collectif en valeurs mobilières sans personnalité morale",
  },
  { code: "1000", label: "Entrepreneur individuel" },
  { code: "2110", label: "Indivision entre personnes physiques" },
  { code: "2120", label: "Indivision avec personne morale" },
  { code: "2210", label: "Société créée de fait entre personnes physiques" },
  { code: "2220", label: "Société créée de fait avec personne morale" },
  { code: "2310", label: "Société en participation entre personnes physiques" },
  { code: "2320", label: "Société en participation avec personne morale" },
  { code: "2385", label: "Société en participation de professions libérales" },
  { code: "2400", label: "Fiducie" },
  { code: "2700", label: "Paroisse hors zone concordataire" },
  { code: "2900", label: "Autre groupement de droit privé non doté de la personnalité morale" },
  {
    code: "3110",
    label: "Représentation ou agence commerciale d'état ou organisme public étranger immatriculé au RCS",
  },
  { code: "3120", label: "Société commerciale étrangère immatriculée au RCS" },
  { code: "3205", label: "Organisation internationale" },
  { code: "3210", label: "État, collectivité ou établissement public étranger" },
  { code: "3220", label: "Société étrangère non immatriculée au RCS" },
  { code: "3290", label: "Autre personne morale de droit étranger" },
  {
    code: "4110",
    label: "Établissement public national à caractère industriel ou commercial doté d'un comptable public",
  },
  {
    code: "4120",
    label: "Établissement public national à caractère industriel ou commercial non doté d'un comptable public",
  },
  { code: "4130", label: "Exploitant public" },
  { code: "4140", label: "Établissement public local à caractère industriel ou commercial" },
  { code: "4150", label: "Régie d'une collectivité locale à caractère industriel ou commercial" },
  { code: "4160", label: "Institution Banque de France" },
  { code: "5191", label: "Société de caution mutuelle" },
  { code: "5192", label: "Société coopérative de banque populaire" },
  { code: "5193", label: "Caisse de crédit maritime mutuel" },
  { code: "5194", label: "Caisse (fédérale) de crédit mutuel" },
  { code: "5195", label: "Association coopérative inscrite (droit local Alsace Moselle)" },
  { code: "5196", label: "Caisse d'épargne et de prévoyance à forme coopérative" },
  { code: "5202", label: "Société en nom collectif" },
  { code: "5203", label: "Société en nom collectif coopérative" },
  { code: "5306", label: "Société en commandite simple" },
  { code: "5307", label: "Société en commandite simple coopérative" },
  { code: "5308", label: "Société en commandite par actions" },
  { code: "5309", label: "Société en commandite par actions coopérative" },
  { code: "5310", label: "Société en libre partenariat (SLP)" },
  {
    code: "5370",
    label: "Société de Participations Financières de Profession Libérale Société en commandite par actions (SPFPL SCA)",
  },
  { code: "5385", label: "Société d'exercice libéral en commandite par actions" },
  { code: "5410", label: "SARL nationale" },
  { code: "5415", label: "SARL d'économie mixte" },
  { code: "5422", label: "SARL immobilière pour le commerce et l'industrie (SICOMI)" },
  { code: "5426", label: "SARL immobilière de gestion" },
  { code: "5430", label: "SARL d'aménagement foncier et d'équipement rural (SAFER)" },
  { code: "5431", label: "SARL mixte d'intérêt agricole (SMIA)" },
  { code: "5432", label: "SARL d'intérêt collectif agricole (SICA)" },
  { code: "5442", label: "SARL d'attribution" },
  { code: "5443", label: "SARL coopérative de construction" },
  { code: "5451", label: "SARL coopérative de consommation" },
  { code: "5453", label: "SARL coopérative artisanale" },
  { code: "5454", label: "SARL coopérative d'intérêt maritime" },
  { code: "5455", label: "SARL coopérative de transport" },
  { code: "5458", label: "SARL coopérative ouvrière de production (SCOP)" },
  { code: "5459", label: "SARL union de sociétés coopératives" },
  { code: "5460", label: "Autre SARL coopérative" },
  {
    code: "5470",
    label: "Société de Participations Financières de Profession Libérale Société à responsabilité limitée (SPFPL SARL)",
  },
  { code: "5485", label: "Société d'exercice libéral à responsabilité limitée" },
  { code: "5499", label: "Société à responsabilité limitée (sans autre indication)" },
  { code: "5505", label: "SA à participation ouvrière à conseil d'administration" },
  { code: "5510", label: "SA nationale à conseil d'administration" },
  { code: "5515", label: "SA d'économie mixte à conseil d'administration" },
  { code: "5520", label: "Fonds à forme sociétale à conseil d'administration" },
  { code: "5522", label: "SA immobilière pour le commerce et l'industrie (SICOMI) à conseil d'administration" },
  { code: "5525", label: "SA immobilière d'investissement à conseil d'administration" },
  { code: "5530", label: "SA d'aménagement foncier et d'équipement rural (SAFER) à conseil d'administration" },
  { code: "5531", label: "Société anonyme mixte d'intérêt agricole (SMIA) à conseil d'administration" },
  { code: "5532", label: "SA d'intérêt collectif agricole (SICA) à conseil d'administration" },
  { code: "5542", label: "SA d'attribution à conseil d'administration" },
  { code: "5543", label: "SA coopérative de construction à conseil d'administration" },
  { code: "5546", label: "SA de HLM à conseil d'administration" },
  { code: "5547", label: "SA coopérative de production de HLM à conseil d'administration" },
  { code: "5548", label: "SA de crédit immobilier à conseil d'administration" },
  { code: "5551", label: "SA coopérative de consommation à conseil d'administration" },
  { code: "5552", label: "SA coopérative de commerçants-détaillants à conseil d'administration" },
  { code: "5553", label: "SA coopérative artisanale à conseil d'administration" },
  { code: "5554", label: "SA coopérative (d'intérêt) maritime à conseil d'administration" },
  { code: "5555", label: "SA coopérative de transport à conseil d'administration" },
  { code: "5558", label: "SA coopérative ouvrière de production (SCOP) à conseil d'administration" },
  { code: "5559", label: "SA union de sociétés coopératives à conseil d'administration" },
  { code: "5560", label: "Autre SA coopérative à conseil d'administration" },
  {
    code: "5570",
    label:
      "Société de Participations Financières de Profession Libérale Société anonyme à conseil d'administration (SPFPL SA à conseil d'administration)",
  },
  { code: "5585", label: "Société d'exercice libéral à forme anonyme à conseil d'administration" },
  { code: "5599", label: "SA à conseil d'administration (s.a.i.)" },
  { code: "5605", label: "SA à participation ouvrière à directoire" },
  { code: "5610", label: "SA nationale à directoire" },
  { code: "5615", label: "SA d'économie mixte à directoire" },
  { code: "5620", label: "Fonds à forme sociétale à directoire" },
  { code: "5622", label: "SA immobilière pour le commerce et l'industrie (SICOMI) à directoire" },
  { code: "5625", label: "SA immobilière d'investissement à directoire" },
  { code: "5630", label: "Safer anonyme à directoire" },
  { code: "5631", label: "SA mixte d'intérêt agricole (SMIA)" },
  { code: "5632", label: "SA d'intérêt collectif agricole (SICA)" },
  { code: "5642", label: "SA d'attribution à directoire" },
  { code: "5643", label: "SA coopérative de construction à directoire" },
  { code: "5646", label: "SA de HLM à directoire" },
  { code: "5647", label: "Société coopérative de production de HLM anonyme à directoire" },
  { code: "5648", label: "SA de crédit immobilier à directoire" },
  { code: "5651", label: "SA coopérative de consommation à directoire" },
  { code: "5652", label: "SA coopérative de commerçants-détaillants à directoire" },
  { code: "5653", label: "SA coopérative artisanale à directoire" },
  { code: "5654", label: "SA coopérative d'intérêt maritime à directoire" },
  { code: "5655", label: "SA coopérative de transport à directoire" },
  { code: "5658", label: "SA coopérative ouvrière de production (SCOP) à directoire" },
  { code: "5659", label: "SA union de sociétés coopératives à directoire" },
  { code: "5660", label: "Autre SA coopérative à directoire" },
  {
    code: "5670",
    label:
      "Société de Participations Financières de Profession Libérale Société anonyme à Directoire (SPFPL SA à directoire)",
  },
  { code: "5685", label: "Société d'exercice libéral à forme anonyme à directoire" },
  { code: "5699", label: "SA à directoire (s.a.i.)" },
  { code: "5710", label: "SAS, société par actions simplifiée" },
  {
    code: "5770",
    label: "Société de Participations Financières de Profession Libérale Société par actions simplifiée (SPFPL SAS)",
  },
  { code: "5785", label: "Société d'exercice libéral par action simplifiée" },
  { code: "5800", label: "Société européenne" },
  { code: "6100", label: "Caisse d'Épargne et de Prévoyance" },
  { code: "6210", label: "Groupement européen d'intérêt économique (GEIE)" },
  { code: "6220", label: "Groupement d'intérêt économique (GIE)" },
  { code: "6316", label: "Coopérative d'utilisation de matériel agricole en commun (CUMA)" },
  { code: "6317", label: "Société coopérative agricole" },
  { code: "6318", label: "Union de sociétés coopératives agricoles" },
  { code: "6411", label: "Société d'assurance à forme mutuelle" },
  { code: "6511", label: "Sociétés Interprofessionnelles de Soins Ambulatoires" },
  { code: "6521", label: "Société civile de placement collectif immobilier (SCPI)" },
  { code: "6532", label: "Société civile d'intérêt collectif agricole (SICA)" },
  { code: "6533", label: "Groupement agricole d'exploitation en commun (GAEC)" },
  { code: "6534", label: "Groupement foncier agricole" },
  { code: "6535", label: "Groupement agricole foncier" },
  { code: "6536", label: "Groupement forestier" },
  { code: "6537", label: "Groupement pastoral" },
  { code: "6538", label: "Groupement foncier et rural" },
  { code: "6539", label: "Société civile foncière" },
  { code: "6540", label: "Société civile immobilière" },
  { code: "6541", label: "Société civile immobilière de construction-vente" },
  { code: "6542", label: "Société civile d'attribution" },
  { code: "6543", label: "Société civile coopérative de construction" },
  { code: "6544", label: "Société civile immobilière d' accession progressive à la propriété" },
  { code: "6551", label: "Société civile coopérative de consommation" },
  { code: "6554", label: "Société civile coopérative d'intérêt maritime" },
  { code: "6558", label: "Société civile coopérative entre médecins" },
  { code: "6560", label: "Autre société civile coopérative" },
  { code: "6561", label: "SCP d'avocats" },
  { code: "6562", label: "SCP d'avocats aux conseils" },
  { code: "6563", label: "SCP d'avoués d'appel" },
  { code: "6564", label: "SCP d'huissiers" },
  { code: "6565", label: "SCP de notaires" },
  { code: "6566", label: "SCP de commissaires-priseurs" },
  { code: "6567", label: "SCP de greffiers de tribunal de commerce" },
  { code: "6568", label: "SCP de conseils juridiques" },
  { code: "6569", label: "SCP de commissaires aux comptes" },
  { code: "6571", label: "SCP de médecins" },
  { code: "6572", label: "SCP de dentistes" },
  { code: "6573", label: "SCP d'infirmiers" },
  { code: "6574", label: "SCP de masseurs-kinésithérapeutes" },
  { code: "6575", label: "SCP de directeurs de laboratoire d'analyse médicale" },
  { code: "6576", label: "SCP de vétérinaires" },
  { code: "6577", label: "SCP de géomètres experts" },
  { code: "6578", label: "SCP d'architectes" },
  { code: "6585", label: "Autre société civile professionnelle" },
  { code: "6589", label: "Société civile de moyens" },
  { code: "6595", label: "Caisse locale de crédit mutuel" },
  { code: "6596", label: "Caisse de crédit agricole mutuel" },
  { code: "6597", label: "Société civile d'exploitation agricole" },
  { code: "6598", label: "Exploitation agricole à responsabilité limitée" },
  { code: "6599", label: "Autre société civile" },
  { code: "6901", label: "Autre personne de droit privé inscrite au registre du commerce et des sociétés" },
  { code: "7111", label: "Autorité constitutionnelle" },
  { code: "7112", label: "Autorité administrative ou publique indépendante" },
  { code: "7113", label: "Ministère" },
  { code: "7120", label: "Service central d'un ministère" },
  { code: "7150", label: "Service du ministère de la Défense" },
  { code: "7160", label: "Service déconcentré à compétence nationale d'un ministère (hors Défense)" },
  { code: "7171", label: "Service déconcentré de l'État à compétence (inter) régionale" },
  { code: "7172", label: "Service déconcentré de l'État à compétence (inter) départementale" },
  { code: "7179", label: "(Autre) Service déconcentré de l'État à compétence territoriale" },
  { code: "7190", label: "Ecole nationale non dotée de la personnalité morale" },
  { code: "7210", label: "Commune et commune nouvelle" },
  { code: "7220", label: "Département" },
  { code: "7225", label: "Collectivité et territoire d'Outre Mer" },
  { code: "7229", label: "(Autre) Collectivité territoriale" },
  { code: "7230", label: "Région" },
  { code: "7312", label: "Commune associée et commune déléguée" },
  { code: "7313", label: "Section de commune" },
  { code: "7314", label: "Ensemble urbain" },
  { code: "7321", label: "Association syndicale autorisée" },
  { code: "7322", label: "Association foncière urbaine" },
  { code: "7323", label: "Association foncière de remembrement" },
  { code: "7331", label: "Établissement public local d'enseignement" },
  { code: "7340", label: "Pôle métropolitain" },
  { code: "7341", label: "Secteur de commune" },
  { code: "7342", label: "District urbain" },
  { code: "7343", label: "Communauté urbaine" },
  { code: "7344", label: "Métropole" },
  { code: "7345", label: "Syndicat intercommunal à vocation multiple (SIVOM)" },
  { code: "7346", label: "Communauté de communes" },
  { code: "7347", label: "Communauté de villes" },
  { code: "7348", label: "Communauté d'agglomération" },
  { code: "7349", label: "Autre établissement public local de coopération non spécialisé ou entente" },
  { code: "7351", label: "Institution interdépartementale ou entente" },
  { code: "7352", label: "Institution interrégionale ou entente" },
  { code: "7353", label: "Syndicat intercommunal à vocation unique (SIVU)" },
  { code: "7354", label: "Syndicat mixte fermé" },
  { code: "7355", label: "Syndicat mixte ouvert" },
  { code: "7356", label: "Commission syndicale pour la gestion des biens indivis des communes" },
  { code: "7357", label: "Pôle d'équilibre territorial et rural (PETR)" },
  { code: "7361", label: "Centre communal d'action sociale" },
  { code: "7362", label: "Caisse des écoles" },
  { code: "7363", label: "Caisse de crédit municipal" },
  { code: "7364", label: "Établissement d'hospitalisation" },
  { code: "7365", label: "Syndicat inter hospitalier" },
  { code: "7366", label: "Établissement public local social et médico-social" },
  { code: "7367", label: "Centre Intercommunal d'action sociale (CIAS)" },
  { code: "7371", label: "Office public d'habitation à loyer modéré (OPHLM)" },
  { code: "7372", label: "Service départemental d'incendie et de secours (SDIS)" },
  { code: "7373", label: "Établissement public local culturel" },
  { code: "7378", label: "Régie d'une collectivité locale à caractère administratif" },
  { code: "7379", label: "(Autre) Établissement public administratif local" },
  { code: "7381", label: "Organisme consulaire" },
  { code: "7382", label: "Établissement public national ayant fonction d'administration centrale" },
  { code: "7383", label: "Établissement public national à caractère scientifique culturel et professionnel" },
  { code: "7384", label: "Autre établissement public national d'enseignement" },
  { code: "7385", label: "Autre établissement public national administratif à compétence territoriale limitée" },
  { code: "7389", label: "Établissement public national à caractère administratif" },
  { code: "7410", label: "Groupement d'intérêt public (GIP)" },
  { code: "7430", label: "Établissement public des cultes d'Alsace-Lorraine" },
  { code: "7450", label: "Etablissement public administratif, cercle et foyer dans les armées" },
  { code: "7470", label: "Groupement de coopération sanitaire à gestion publique" },
  { code: "7490", label: "Autre personne morale de droit administratif" },
  { code: "8110", label: "Régime général de la Sécurité Sociale" },
  { code: "8120", label: "Régime spécial de Sécurité Sociale" },
  { code: "8130", label: "Institution de retraite complémentaire" },
  { code: "8140", label: "Mutualité sociale agricole" },
  { code: "8150", label: "Régime maladie des non-salariés non agricoles" },
  { code: "8160", label: "Régime vieillesse ne dépendant pas du régime général de la Sécurité Sociale" },
  { code: "8170", label: "Régime d'assurance chômage" },
  { code: "8190", label: "Autre régime de prévoyance sociale" },
  { code: "8210", label: "Mutuelle" },
  { code: "8250", label: "Assurance mutuelle agricole" },
  { code: "8290", label: "Autre organisme mutualiste" },
  { code: "8310", label: "Comité social économique d’entreprise" },
  { code: "8311", label: "Comité social économique d'établissement" },
  { code: "8410", label: "Syndicat de salariés" },
  { code: "8420", label: "Syndicat patronal" },
  { code: "8450", label: "Ordre professionnel ou assimilé" },
  { code: "8470", label: "Centre technique industriel ou comité professionnel du développement économique" },
  { code: "8490", label: "Autre organisme professionnel" },
  { code: "8510", label: "Institution de prévoyance" },
  { code: "8520", label: "Institution de retraite supplémentaire" },
  { code: "9110", label: "Syndicat de copropriété" },
  { code: "9150", label: "Association syndicale libre" },
  { code: "9210", label: "Association non déclarée" },
  { code: "9220", label: "Association déclarée" },
  { code: "9221", label: "Association déclarée d'insertion par l'économique" },
  { code: "9222", label: "Association intermédiaire" },
  { code: "9223", label: "Groupement d'employeurs" },
  { code: "9224", label: "Association d'avocats à responsabilité professionnelle individuelle" },
  { code: "9230", label: "Association déclarée, reconnue d'utilité publique" },
  { code: "9240", label: "Congrégation" },
  { code: "9260", label: "Association de droit local (Bas-Rhin, Haut-Rhin et Moselle)" },
  { code: "9300", label: "Fondation" },
  { code: "9900", label: "Autre personne morale de droit privé" },
  { code: "9970", label: "Groupement de coopération sanitaire à gestion privée" },
];

function fincCategorieJuridiqueByCode(code) {
  if (!code) {
    return null;
  }

  return CATEGORIES.find((cj) => cj.code === code) || null;
}

module.exports = {
  fincCategorieJuridiqueByCode,
};
