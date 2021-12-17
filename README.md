# Référentiel

Le référentiel regroupe les organismes qui dispensent des formations en apprentissage.

Il se base sur trois listes d'organismes fournies par la DEPP, la DGEFP et la mission apprentissage. 
Ces organismes sont importés dans l'annuaire au moyen de scripts.

Pour chacun des organismes importés, des scripts vont ensuite collecter des informations dans les différentes
sources dont la mission apprentissage dispose :

- Fichiers réseaux
- Datadock
- Catalogue des formations
- Fichiers ERP
- ONISEP
- REFEA
- API Sirene

![annuaire schéma](./misc/doc/annuaire.png)

## API

L'api permet de consulter les organismes issus des référentiels ainsi que les données collectées dans les sources.
Cet API est actuellement composée de deux routes.

### /api/v1/organismes

Permet de lister les organismes contenus dans l'annuaire

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

Pour lancer l'application :

```sh
make install
make start
```

Cette commande démarre les containers définis dans le fichier `docker-compose.yml` et `docker-compose.override.yml`

L'application est ensuite accessible à l'url [http://localhost](http://localhost)

Il est possible de créer un jeu de données afin de pouvoir tester l'application

```sh
make dataset
```


![](https://avatars1.githubusercontent.com/u/63645182?s=200&v=4)
