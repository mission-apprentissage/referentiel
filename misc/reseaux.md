# Réséaux

## Génération des fichiers de réseau

Les commandes à lancer sont les suivantes :

### Fichiers CSV

#### Relations pour les organismes de nature 'responsable' et 'responsable_formateur' du réseau EC

```shell
yarn cli exportReseaux "cfa ec" \
--natures "responsable,responsable_formateur" \
--out relations-pour-les-organismes-responsables-et-formateurs-$(date +'%Y-%m-%d_%H%M').csv
```

#### Relations de type 'responsable' pour les organismes de nature 'formateur' du réseau EC

```shell
yarn cli exportReseaux "cfa ec" \
--natures "formateur" \
--relations "formateur->responsable" \
--out relations-responsable-pour-les-organismes-formateurs-$(date +'%Y-%m-%d_%H%M').csv
```

### Fichiers SVG

Pour générer les graphes, il est nécessaire d'installer [Graphviz](https://graphviz.org/) puis de lancer la commande
suivante

```shell
yarn --silent pipe exportReseaux nomDuReseau --regions codeInseeRegion --graph | fdp -Tsvg -o relations-reseaux-$(date +'%Y-%m-%d_%H%M').svg
```

*Pour information `yarn --silent pipe` permet de rediriger la sortie standard vers une autre commande*

La commande `exportReseaux` peut-être appelée avec d'autres paramètres pour plus d'informations

```shell
yarn cli exportReseaux --help
```
