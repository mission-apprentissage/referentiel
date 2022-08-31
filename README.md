# Référentiel

Le référentiel regroupe les organismes qui dispensent ou ont dispensé des formations en apprentissage.

Il se base sur trois listes d'organismes fournies par la DEPP, la DGEFP et la mission apprentissage.

Ces organismes sont importés dans le référentiel au moyen de scripts des scripts vont ensuite collecter des informations
dans les différentes sources dont la mission apprentissage dispose :

- Fichiers réseaux
- Datadock
- Catalogue des formations
- Fichiers ERP
- ONISEP
- REFEA
- API Sirene

![annuaire schéma](./misc/doc/annuaire.png)

## API

L'api permet de consulter les organismes importés.

Cet API est actuellement composée de deux routes.

Pour plus détails vous pouvez consulter la documentation [Swagger](https://referentiel.apprentissage.beta.gouv.fr/api/v1/doc/#/Publique/post_api_v1_organismes).

### /api/v1/organismes

Permet de rechercher et exporter des organismes du référentiel

Exemple : https://referentiel.apprentissage.beta.gouv.fr/api/v1/organismes

### /api/v1/organismes/:siret

Permet d'obtenir les informations relatives à un organisme à partir de son numéro de SIRET

Exemple : https://referentiel.apprentissage.beta.gouv.fr/api/v1/organismes/77928324100056

## Développement

![ci](https://github.com/mission-apprentissage/referentiel/actions/workflows/ci.yml/badge.svg)
![codecov](https://codecov.io/gh/mission-apprentissage/referentiel/branch/main/graph/badge.svg?token=CVNNCH0GYA)
![uptime](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmission-apprentissage%2Fupptime%2Fmaster%2Fapi%2Fapi-referentiel%2Fuptime.json)

### Pré-requis

- Docker 19+
- Docker-compose 1.27+

### Démarrage

#### Lancement de l'application

```sh
make install
make start
```

Cette commande démarre les containers définis dans le fichier `docker-compose.yml` et `docker-compose.override.yml`

L'application est ensuite accessible à l'url [http://localhost](http://localhost)


#### Construction du référentiel

Avant de lancer les scripts, il nécessaire de configurer des variables d'environnement.
En effet le référentiel utilise plusieurs API dont certaines requièrent une authentification.

Il faut donc éditer le fichier `server/.env` et ajouter les variables suivantes :

```
REFERENTIEL_OVH_STORAGE_URI=...
REFERENTIEL_SIRENE_API_CONSUMER_KEY=...
REFERENTIEL_SIRENE_API_CONSUMER_SECRET=...
```

Pour obtenir les valeurs, vous devez demander une habilitation qui vous permettra de les récupérer depuis le vault.

Une fois le fichier `server/.env` valorisé, vous devez lancer la commande suivante :

```sh
cd server
yarn cli build
```

Cette commande va importer toutes les données nécessaires puis collecter les informations relatives aux organismes.

Vous pouvez alors consulter les organismes à l'url [http://localhost/organismes](http://localhost/organismes)


![](https://avatars1.githubusercontent.com/u/63645182?s=200&v=4)
