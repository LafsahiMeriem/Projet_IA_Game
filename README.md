   # Rapport du Mini-projet.
   
   # Idée générale sur le jeux.
   Notre mini-projet est sous forme d'une jeux avec des mouvements spécifique, ce jeux est réalisé par javaSript native. Ce projet est encadré par monsieur Michel Buffa le Professeur 
   de la mission .

   # Ce que j'ai réalisé.
   Dans cette jeux la j'ai fait un canvas qui contient une souris rouge et je l'ai entouré par un cadre de cercle blanc, on a les vehicules qui suivre un leader aussi un vehicule on mode snake. On cliquant sur la lettre "v" on peux ajouter une seule vehicule, on cliquant sur la lettre "f" on peux ajouter plusieur vehicules, on cliquant sur la lettre "d" on fait un debug (concerant la methode debug j'ai gardé celle que vous avez fait avec nous durant les exercices), on cliquant sur la lettre "w" les vehicules fait un comportement de mouvement aléatoire. Aussi j'ai forté au vehicules de ne pas sortir du canvas elles renstent à l'intérieur. j'ai fait aussi un évitement d'obstacles , j'ai ajouté 3 curseurs de réglage des paramétres, un pour la vitesse des vehicules "maxSpeedSlider" , un pour la distance entre les vehicules "distanceAheadSlider", et un pour "maxForceSlider".

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
 show(): Dessine la cible.
 
 # Note finale
Le code simule le comportement de véhicules autonomes dans un environnement virtuel, avec des fonctionnalités telles que la recherche, l'évitement d'obstacles, la séparation entre les véhicules, etc. La simulation est interactive et utilise p5.js pour la visualisation.