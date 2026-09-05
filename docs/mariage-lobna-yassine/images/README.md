# Où déposer les photos

Placez simplement vos fichiers **dans ce dossier**, puis déclarez-les dans
`../js/config.js`. Aucun traitement n'est nécessaire côté code.

## Fichiers attendus par défaut

| Fichier        | Rôle                                   | Format conseillé          |
|----------------|----------------------------------------|---------------------------|
| `couple.jpg`   | Photo de fond de la page d'accueil     | **1600 × 2000 px**, portrait ou carré |
| `photo-1.jpg` … `photo-6.jpg` | Galerie                 | **1200 × 1200 px**, carré |

Les noms ne sont pas imposés : ils sont listés dans `config.js`, changez-les
librement. Vous pouvez mettre plus ou moins de six photos — ajoutez ou
supprimez des lignes dans le tableau `galerie`.

## Trois conseils qui comptent

1. **Poids.** Visez **moins de 300 Ko par photo**. Une photo sortie
   d'un téléphone pèse souvent 4 Mo : sur la 4G d'une salle de réception,
   six photos non compressées font une page qui ne se charge pas.
   Passez-les par un outil de compression (Squoosh, TinyJPG…) avant de les
   déposer.
2. **Cadrage.** Les vignettes de la galerie sont **carrées** et recadrées
   automatiquement depuis le centre. Une photo très allongée y perdra ses
   bords — la version plein écran, elle, reste entière.
3. **Photo d'accueil.** Elle est recouverte d'un voile sombre pour que les
   prénoms restent lisibles. Choisissez une image dont le centre n'est pas
   déjà très sombre, sinon le sujet disparaît.

## Si une photo manque

Rien ne casse : la vignette concernée disparaît, et la photo d'accueil est
remplacée par un dégradé de la palette. Le site reste présentable même
totalement vide de photos.
