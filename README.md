# Référentiel

Le référentiel regroupe les établissements qui dispensent des formations en apprentissage.

Il se base sur trois listes d'établissements fournies par la DEPP, la DGEFP et la mission apprentissage. 
Ces établissements sont importés dans l'annuaire au moyen de scripts.

Pour chacun des établissements importés, des scripts vont ensuite collecter des informations dans les différentes
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

L'api permet de consulter les établissements issus des référentiels ainsi que les données collectées dans les sources.
Cet API est actuellement composée de deux routes.

### /api/v1/etablissements

Permet de lister les établissements contenus dans l'annuaire

Exemple : https://referentiel.apprentissage.beta.gouv.fr/api/v1/annuaire/etablissements

### /api/v1/etablissements/:siret

Permet d'obtenir les informations relatives à un établissement à partir de son numéro de SIRET

Exemple : https://referentiel.apprentissage.beta.gouv.fr/api/v1/annuaire/etablissements/77928324100056

## Développement

[![codecov](https://codecov.io/gh/mission-apprentissage/referentiel/branch/main/graph/badge.svg?token=CVNNCH0GYA)](https://codecov.io/gh/mission-apprentissage/referentiel)

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
