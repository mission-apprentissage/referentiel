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

Exemples pour exporter le reseau "cfa ec" pour toutes les régions

```shell
yarn --silent pipe exportReseaux "cfa ec" --regions "01" --graph | fdp -Tsvg -o "relations-reseaux-Guadeloupe-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "02" --graph | fdp -Tsvg -o "relations-reseaux-Martinique-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "03" --graph | fdp -Tsvg -o "relations-reseaux-Guyane-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "04" --graph | fdp -Tsvg -o "relations-reseaux-La Réunion-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "06" --graph | fdp -Tsvg -o "relations-reseaux-Mayotte-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "11" --graph | fdp -Tsvg -o "relations-reseaux-Île-de-France-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "24" --graph | fdp -Tsvg -o "relations-reseaux-Centre-Val de Loire-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "27" --graph | fdp -Tsvg -o "relations-reseaux-Bourgogne-Franche-Comté-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "28" --graph | fdp -Tsvg -o "relations-reseaux-Normandie-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "32" --graph | fdp -Tsvg -o "relations-reseaux-Hauts-de-France-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "44" --graph | fdp -Tsvg -o "relations-reseaux-Grand Est-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "52" --graph | fdp -Tsvg -o "relations-reseaux-Pays de la Loire-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "53" --graph | fdp -Tsvg -o "relations-reseaux-Bretagne-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "75" --graph | fdp -Tsvg -o "relations-reseaux-Nouvelle-Aquitaine-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "76" --graph | fdp -Tsvg -o "relations-reseaux-Occitanie-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "84" --graph | fdp -Tsvg -o "relations-reseaux-Auvergne-Rhône-Alpes-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "93" --graph | fdp -Tsvg -o "relations-reseaux-Provence-Alpes-Côte d'Azur-$(date +'%Y-%m-%d_%H%M').svg"
yarn --silent pipe exportReseaux "cfa ec" --regions "94" --graph | fdp -Tsvg -o "relations-reseaux-Corse-$(date +'%Y-%m-%d_%H%M').svg"
```

