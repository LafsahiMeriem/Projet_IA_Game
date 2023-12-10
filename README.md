   # Rapport du Mini-projet.
  __Meriem Lafsahi 5IIR M2 IA2 Casablanca__
   
   # Idée générale sur le jeux.
   Notre mini-projet est sous forme d'une jeux avec des mouvements spécifique, ce jeux est réalisé par javaSript native. Ce projet est encadré par monsieur Michel Buffa le Professeur 
   de la mission .

   # Ce que j'ai réalisé.
   Dans cette jeux la j'ai fait un canvas qui contient une souris rouge et je l'ai entouré par un cadre de cercle blanc, on a les vehicules qui suivre un leader aussi un vehicule on mode snake. On cliquant sur la lettre "v" on peux ajouter une seule vehicule, on cliquant sur la lettre "f" on peux ajouter plusieur vehicules, on cliquant sur la lettre "d" on fait un debug (concerant la methode debug j'ai gardé celle que vous avez fait avec nous durant les exercices), on cliquant sur la lettre "w" les vehicules fait un comportement de mouvement aléatoire. Aussi j'ai forté au vehicules de ne pas sortir du canvas elles renstent à l'intérieur. j'ai fait aussi un évitement d'obstacles , j'ai ajouté 3 curseurs de réglage des paramétres, un pour la vitesse des vehicules "maxSpeedSlider" , un pour la distance entre les vehicules "distanceAheadSlider", et un pour "maxForceSlider".

  # Explication concernent vehicle.js
   # Fonction findProjection(pos, a, b)
  Cette fonction calcule la projection orthogonale du vecteur a sur le vecteur b. Elle utilise la bibliothèque p5.js pour manipuler des vecteurs.

  # Classe Vehicle
  ___Attributs__
  pos: Vecteur représentant la position du véhicule.
  vel: Vecteur représentant la vitesse du véhicule.
  acc: Vecteur représentant l'accélération du véhicule.
  maxSpeed: Vitesse maximale du véhicule.
  maxForce: Force maximale appliquée au véhicule.
  color: Couleur du véhicule.
  dureeDeVie: Durée de vie du véhicule.
  r_pourDessin: Rayon du véhicule pour le dessin.
  r: Rayon du véhicule pour l'évitement.
  largeurZoneEvitementDevantVaisseau: Largeur de la zone d'évitement devant le véhicule.
  distanceAhead: Distance devant le véhicule pour la détection des obstacles.
  path: Tableau pour stocker le chemin suivi par le véhicule.
  pathMaxLength: Longueur maximale du chemin.
  rayonZoneDeFreinage: Rayon de la zone de freinage.
  poidsSeparation: Poids pour le comportement de séparation.
  health: Santé du véhicule.
  dna: Tableau pour stocker des informations génétiques du véhicule.

__Méthodes__

__drawMouse(mousePos)__: Dessine un cercle représentant la souris (mouse) sur la tête du véhicule.
__boundaries():__ Applique une force pour ramener le véhicule au centre du canvas s'il s'approche des bords.
__wander():__ Implémente le comportement d'errance.
__applyBehaviors(target, obstacles, vehicules, distance):__ Applique différents comportements tels que la recherche (seek), l'évitement d'obstacles (avoid), la séparation (separate), et l'arrêt lorsque le véhicule est proche de la cible.
__align(leader):__ Applique un comportement d'alignement envers un "leader".
__follow(previousVehicle):__ Applique un comportement pour suivre un véhicule précédent.
__avoid(obstacles):__ Implémente le comportement d'évitement d'obstacles.
__avoidVehicules(vehicules):__ Implémente le comportement d'évitement d'autres véhicules.
__getObstacleLePlusProche(obstacles):__ Retourne l'obstacle le plus proche.
__getVehiculeLePlusProche(vehicules):__ Retourne le véhicule le plus proche.
__separate(boids):__ Applique le comportement de séparation pour éviter les collisions avec d'autres véhicules.
__arrive(target, distanceVisee):__ Implémente le comportement d'arrivée vers une cible.
__seek(target, arrival, distanceVisee):__ Implémente le comportement de recherche vers une cible.
__flee(target):__ Implémente le comportement de fuite d'une cible.
__pursue(vehicle):__ Implémente le comportement de poursuite d'un véhicule.
__evade(vehicle):__ Implémente le comportement d'évitement d'un véhicule.
__applyForce(force):__ Applique une force au véhicule.
__update():__ Met à jour la position, la vitesse, et d'autres propriétés du véhicule.
__ajoutePosAuPath():__ Ajoute la position actuelle au chemin suivi par le véhicule.
__show():__ Dessine le véhicule et son chemin.
__drawVehicle():__ Dessine le véhicule.
__drawPath():__ Dessine le chemin suivi par le véhicule.
__drawVector(pos, v, color):__ Dessine un vecteur à partir de la position spécifiée.
  
  # Classe Target
 Cette classe hérite de la classe Vehicle et représente une cible mobile.
 __show():__ Dessine la cible.
 
 # Note finale
Le code simule le comportement de véhicules autonomes dans un environnement virtuel, avec des fonctionnalités telles que la recherche, l'évitement d'obstacles, la séparation entre les véhicules, etc. La simulation est interactive et utilise p5.js pour la visualisation.


  # Explication concernent sketch.js
Ce code semble être un sketch p5.js, une bibliothèque JavaScript dédiée à la création artistique et interactive. Le sketch consiste à créer des véhicules qui suivent une cible (la souris) ou les uns les autres selon un motif semblable à un serpent. Le code inclut des fonctionnalités telles que des curseurs pour contrôler différents paramètres, la possibilité d'ajouter des obstacles par clic de souris, et des commandes clavier pour manipuler le comportement des véhicules.

# Curseurs de Contrôle :
Trois curseurs __(maxSpeedSlider, maxForceSlider, distanceAheadSlider)__ sont créés pour permettre un réglage interactif des paramètres des véhicules.
__maxSpeedSlider__ ajuste la vitesse maximale des véhicules.
__maxForceSlider__ ajuste la force maximale qui peut être appliquée par les véhicules.
distanceAheadSlider ajuste une distance spécifique à laquelle les véhicules peuvent réagir à la cible

# Cible (Souris Rouge) :
Une position __sourisRougePosition__ est mise à jour à chaque itération du dessin pour suivre la position actuelle de la souris.

# Modes de Déplacement des Véhicules :

Le code permet deux modes de déplacement, sélectionnés par la variable demo : "random" et "snake".
En mode "random", chaque véhicule est indépendant et suit aléatoirement la cible.
En mode "snake", les véhicules forment une séquence où le premier suit la cible, et les suivants suivent le précédent, créant ainsi un effet de serpent.

# Obstacles :
Des obstacles peuvent être ajoutés à la position de la souris lorsque le bouton de la souris est pressé. Chaque obstacle a une taille aléatoire.

# Contrôle Clavier :
Appuyer sur la touche "v" ajoute un nouveau véhicule à une position aléatoire.
Appuyer sur la touche "l" sélectionne le mode "snake".
Appuyer sur la touche "d" active ou désactive le mode de débogage.
Appuyer sur la touche "w" active ou désactive le mode d'errance (wandering).
Appuyer sur la touche "f" ajoute plusieur véhicule à une position aléatoire.

# Gestion de Nombre de Véhicules :
En appuyant sur la touche "f", 10 véhicules supplémentaires avec des propriétés spécifiques sont ajoutés, créant un effet intéressant à partir du bord gauche de l'écran.


# Note:

Dans la réalisation de ce jeux j'ai pris quelque notion à partir des exercices corrigé quand a fait durant la mission, j'ai utilisé aussi chatgpt mais il n'a pas beaucoup m'aider.

