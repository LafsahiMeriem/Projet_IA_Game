
/*
  Calcule la projection orthogonale du point a sur le vecteur b
  a et b sont des vecteurs calculés comme ceci :
  let v1 = p5.Vector.sub(a, pos); soit v1 = pos -> a
  let v2 = p5.Vector.sub(b, pos); soit v2 = pos -> b
  */
  function findProjection(pos, a, b) {
    let v1 = p5.Vector.sub(a, pos);
    let v2 = p5.Vector.sub(b, pos);
    v2.normalize();
    let sp = v1.dot(v2);
    v2.mult(sp);
    v2.add(pos);
    return v2;
  }
  var mr = 0.01;
  
  class Vehicle {
    static debug = false;
  
    constructor(x, y, imageVaisseau) {
      this.imageVaisseau = imageVaisseau;
      // position du véhicule
      this.pos = createVector(x, y);
      // vitesse du véhicule
      this.vel = createVector(0, -2);
      // accélération du véhicule
      this.acc = createVector(0, 0);
      // vitesse maximale du véhicule
      this.maxSpeed = 4;
      // force maximale appliquée au véhicule
      this.maxForce = 0.7;
      this.color = "white";
      // à peu près en secondes
      this.dureeDeVie = 5;
  
      this.r_pourDessin = 24;
      // rayon du véhicule pour l'évitement
      this.r = this.r_pourDessin * 3;
  
      // Pour évitement d'obstacle
      this.largeurZoneEvitementDevantVaisseau = this.r / 2;
      this.distanceAhead = 30;
  
      // chemin derrière vaisseaux
      this.path = [];
      this.pathMaxLength = 30;
      this.rayonZoneDeFreinage = 100;
  
      //pour comportement separation
      this.poidsSeparation = 0.5;
      
      this.health = 1;
      this.dna = [];
      

      
  
  
    }
    
  

   drawMouse(mousePos) {
    push();
    fill("green");  // Couleur verte
    noStroke();
    ellipse(this.pos.x, this.pos.y, 20, 20);  // Dessiner la souris verte
    stroke("black");  // Couleur noire pour les yeux
    strokeWeight(2);
    point(this.pos.x - 5, this.pos.y - 5);  // Oeil gauche
    point(this.pos.x + 5, this.pos.y - 5);  // Oeil droit
    line(this.pos.x - 5, this.pos.y + 5, this.pos.x + 5, this.pos.y + 5);  // Bouche
    pop();
  }
    // Exerce une force renvoyant vers le centre du canvas si le véhicule s'approche
    // des bords du canvas
    boundaries() {
      const d = 25;
  
      let desired = null;
  
      if (this.pos.x < d) {
        desired = createVector(this.maxspeed, this.vel.y);
      } else if (this.pos.x > width - d) {
        desired = createVector(-this.maxspeed, this.vel.y);
      }
  
      if (this.pos.y < d) {
        desired = createVector(this.vel.x, this.maxspeed);
      } else if (this.pos.y > height - d) {
        desired = createVector(this.vel.x, -this.maxspeed);
      }
  
      if (desired !== null) {
        desired.normalize();
        desired.mult(this.maxspeed);
        const steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        this.applyForce(steer);
      }
    }

    wander() {
      let wanderR = 25; // rayon de la "circonférence" du wander
      let wanderD = 80; // distance à la "circonférence" du wander
      let change = 0.3;
    
      let circlePos = createVector(width / 2, height / 2);
      circlePos.add(this.vel.copy().normalize().mult(wanderD));

      let displacement = createVector(0, -1).mult(wanderR);
      circlePos.add(displacement);
    
      let wanderForce = circlePos.sub(this.pos);
      this.acc.add(wanderForce);
    }
    // on fait une méthode applyBehaviors qui applique les comportements
    // seek et avoid
    applyBehaviors(target, obstacles, vehicules, distance) {
  
      let seekForce = this.seek(target, false,  distance);
      let avoidForceObstacles = this.avoid(obstacles);
      //let avoidForceVehicules = this.avoidVehicules(vehicules);
      let separationForce = this.separate(vehicules);
        // Ajout de la force d'arrêt si le véhicule est à l'intérieur du cercle blanc
      let distanceToTarget = dist(this.pos.x, this.pos.y, target.x, target.y);
      let radiusOfStop = 50; // Ajustez cette valeur selon vos besoins
     
      let arriveForce = this.arrive(target, distance);
      arriveForce.mult(0.2); // Ajustez le coefficient selon vos besoins
      this.applyForce(arriveForce);
      
      seekForce.mult(0.2);
      avoidForceObstacles.mult(0.5);
      //avoidForceVehicules.mult(0);
      separationForce.mult(this.poidsSeparation);
  
      this.applyForce(seekForce);
      this.applyForce(avoidForceObstacles);
      //this.applyForce(avoidForceVehicules);
      this.applyForce(separationForce);

      distanceToTarget = dist(this.pos.x, this.pos.y, target.x, target.y);
      radiusOfStop = 50; // Ajustez cette valeur selon vos besoins
    
      if (distanceToTarget < radiusOfStop) {
        // Force d'arrêt
           let stopForce = this.vel.copy();
           stopForce.mult(-1);
            stopForce.limit(this.maxForce);
           this.applyForce(stopForce);
    }
    if (wanderEnabled) {
      this.wander();
    }
  
    }

    align(leader) {
      return this.seek(leader.pos);
    }

    follow(previousVehicle) {
    let target = createVector(previousVehicle.pos.x, previousVehicle.pos.y);
    let desiredSeparation = 30;
    let offset = p5.Vector.sub(target, this.pos);
    let distance = offset.mag();

    if (distance < desiredSeparation) {
      offset.setMag(map(distance, 0, desiredSeparation, 0, this.maxSpeed));
      offset.mult(-1);// Invert the offset to follow behind
      let steer = p5.Vector.sub(offset, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return this.arrive(target);
    }
  }


  
    // Méthode d'évitement d'obstacle, implémente le comportement avoid
    // renvoie une force (un vecteur) pour éviter l'obstacle
    avoid(obstacles) {
      // calcul d'un vecteur ahead devant le véhicule
      // il regarde par exemple 50 frames devant lui
      let ahead = this.vel.copy();
      ahead.mult(this.distanceAhead);
      // on l'ajoute à la position du véhicule
      let pointAuBoutDeAhead = p5.Vector.add(this.pos, ahead);
  
      if (Vehicle.debug) {
        // on le dessine avec ma méthode this.drawVector(pos vecteur, color)
        this.drawVector(this.pos, ahead, color(255, 0, 0));
        // On dessine ce point au bout du vecteur ahead pour debugger
        fill(255, 0, 255);
        noStroke();
        circle(pointAuBoutDeAhead.x, pointAuBoutDeAhead.y, this.rayonZoneDeFreinage);
  
        // On dessine ce point au bout du vecteur ahead pour debugger
        fill(255, 0, 255);
        noStroke();
        circle(pointAuBoutDeAhead.x, pointAuBoutDeAhead.y, this.rayonZoneDeFreinage);
      }
  
      // Calcule de ahead2, deux fois plus petit que le premier
      let ahead2 = ahead.copy();
      ahead2.mult(0.5);
      let pointAuBoutDeAhead2 = p5.Vector.add(this.pos, ahead2);
      if (Vehicle.debug) {
  
        // on le dessine avec ma méthode this.drawVector(pos vecteur, color)
        this.drawVector(this.pos, ahead2, color("lightblue"));
        // On dessine ce point au bout du vecteur ahead pour debugger
        fill("orange");
        noStroke();
        circle(pointAuBoutDeAhead2.x, pointAuBoutDeAhead2.y, this.rayonZoneDeFreinage);
      }
      // Detection de l'obstacle le plus proche
      let obstacleLePlusProche = this.getObstacleLePlusProche(obstacles);
  
      // Si pas d'obstacle, on renvoie un vecteur nul
      if (obstacleLePlusProche == undefined) {
        return createVector(0, 0);
      }
  
      // On calcule la distance entre le centre du cercle de l'obstacle 
      // et le bout du vecteur ahead
      let distance = obstacleLePlusProche.pos.dist(pointAuBoutDeAhead);
      // et pour ahead2
      let distance2 = obstacleLePlusProche.pos.dist(pointAuBoutDeAhead2);
      // et pour la position du vaiseau
      let distance3 = obstacleLePlusProche.pos.dist(this.pos);
  
      let plusPetiteDistance = min(distance, distance2);
      plusPetiteDistance = min(plusPetiteDistance, distance3);
  
      let pointLePlusProcheDeObstacle = undefined;
      let alerteRougeVaisseauDansObstacle = false;
  
      if (distance == plusPetiteDistance) {
        pointLePlusProcheDeObstacle = pointAuBoutDeAhead;
      } else if (distance2 == plusPetiteDistance) {
        pointLePlusProcheDeObstacle = pointAuBoutDeAhead2;
      } else if (distance3 == plusPetiteDistance) {
        pointLePlusProcheDeObstacle = this.pos;
        // si le vaisseau est dans l'obstacle, alors alerte rouge !
        if (distance3 < obstacleLePlusProche.r) {
          alerteRougeVaisseauDansObstacle = true;
          obstacleLePlusProche.color = color("red");
        } else {
          obstacleLePlusProche.color = "blue";
        }
      }
  
      
      // On dessine la zone d'évitement
      // Pour cela on trace une ligne large qui va de la position du vaisseau
      // jusqu'au point au bout de ahead
      if (Vehicle.debug) {
        stroke(255, 200, 0, 90);
        strokeWeight(this.largeurZoneEvitementDevantVaisseau);
        line(this.pos.x, this.pos.y, pointAuBoutDeAhead.x, pointAuBoutDeAhead.y);
      }
      // si la distance est < rayon de l'obstacle
      // il y a collision possible et on dessine l'obstacle en rouge
  
      if (plusPetiteDistance < obstacleLePlusProche.r + this.largeurZoneEvitementDevantVaisseau) {
        // collision possible
  
        // calcul de la force d'évitement. C'est un vecteur qui va
        // du centre de l'obstacle vers le point au bout du vecteur ahead
        let force = p5.Vector.sub(pointLePlusProcheDeObstacle, obstacleLePlusProche.pos);
  
        // on le dessine en jaune pour vérifier qu'il est ok (dans le bon sens etc)
        if(Vehicle.debug)
          this.drawVector(obstacleLePlusProche.pos, force, "yellow");
  
        // Dessous c'est l'ETAPE 2 : le pilotage (comment on se dirige vers la cible)
        // on limite ce vecteur à la longueur maxSpeed
        // force est la vitesse désirée
        force.setMag(this.maxSpeed);
        // on calcule la force à appliquer pour atteindre la cible avec la formule
        // que vous commencez à connaitre : force = vitesse désirée - vitesse courante
        force.sub(this.vel);
        // on limite cette force à la longueur maxForce
        force.limit(this.maxForce);
  
        if (alerteRougeVaisseauDansObstacle) {
          return force.setMag(this.maxForce * 2);
        } else {
          return force;
        }
  
      } else {
        // pas de collision possible
        return createVector(0, 0);
      }
    }
  
    avoidVehicules(vehicules) {
      // calcul d'un vecteur ahead devant le véhicule
      // il regarde par exemple 50 frames devant lui
      let ahead = this.vel.copy();
      ahead.mult(this.distanceAhead);
      // on l'ajoute à la position du véhicule
      let pointAuBoutDeAhead = p5.Vector.add(this.pos, ahead);
  
      if (Vehicle.debug) {
        // on le dessine avec ma méthode this.drawVector(pos vecteur, color)
        this.drawVector(this.pos, ahead, color(255, 0, 0));
        // On dessine ce point au bout du vecteur ahead pour debugger
        fill(255, 0, 255) // Magenta (rouge + bleu)
        noStroke();
        circle(pointAuBoutDeAhead.x, pointAuBoutDeAhead.y, 10);
  
        // On dessine ce point au bout du vecteur ahead pour debugger
        fill(255, 0, 255) // Magenta (rouge + bleu);
        noStroke();
        circle(pointAuBoutDeAhead.x, pointAuBoutDeAhead.y, 10);
      }
  
      // Calcule de ahead2, deux fois plus petit que le premier
      let ahead2 = ahead.copy();
      ahead2.mult(0.5);
      let pointAuBoutDeAhead2 = p5.Vector.add(this.pos, ahead2);
      if (Vehicle.debug) {
  
        // on le dessine avec ma méthode this.drawVector(pos vecteur, color)
        this.drawVector(this.pos, ahead2, color("lightblue"));
        // On dessine ce point au bout du vecteur ahead pour debugger
        fill(0, 0, 255);
        noStroke();
        circle(pointAuBoutDeAhead2.x, pointAuBoutDeAhead2.y, 10);
      }
      // Detection de l'obstacle le plus proche
      let obstacleLePlusProche = this.getVehiculeLePlusProche(vehicules);
  
      // Si pas d'obstacle, on renvoie un vecteur nul
      if (obstacleLePlusProche == undefined) {
        return createVector(0, 0);
      }
  
      // On calcule la distance entre le centre du cercle de l'obstacle 
      // et le bout du vecteur ahead
      let distance = obstacleLePlusProche.pos.dist(pointAuBoutDeAhead);
      // et pour ahead2
      let distance2 = obstacleLePlusProche.pos.dist(pointAuBoutDeAhead2);
      // et pour la position du vaiseau
      let distance3 = obstacleLePlusProche.pos.dist(this.pos);
  
      let plusPetiteDistance = min(distance, distance2);
      plusPetiteDistance = min(plusPetiteDistance, distance3);
  
      let pointLePlusProcheDeObstacle = undefined;
      let alerteRougeVaisseauDansObstacle = false;
  
      if (distance == plusPetiteDistance) {
        pointLePlusProcheDeObstacle = pointAuBoutDeAhead;
      } else if (distance2 == plusPetiteDistance) {
        pointLePlusProcheDeObstacle = pointAuBoutDeAhead2;
      } else if (distance3 == plusPetiteDistance) {
        pointLePlusProcheDeObstacle = this.pos;
        // si le vaisseau est dans l'obstacle, alors alerte rouge !
        if (distance3 < obstacleLePlusProche.r) {
          alerteRougeVaisseauDansObstacle = true;
          obstacleLePlusProche.color = color("red");
        } else {
          obstacleLePlusProche.color = "blue";
        }
      }
  
      
      // On dessine la zone d'évitement
      // Pour cela on trace une ligne large qui va de la position du vaisseau
      // jusqu'au point au bout de ahead
      if (Vehicle.debug) {
        stroke(255, 200, 0, 90);
        strokeWeight(this.largeurZoneEvitementDevantVaisseau);
        line(this.pos.x, this.pos.y, pointAuBoutDeAhead.x, pointAuBoutDeAhead.y);
      }
      // si la distance est < rayon de l'obstacle
      // il y a collision possible et on dessine l'obstacle en rouge
  
      if (plusPetiteDistance < obstacleLePlusProche.r + this.largeurZoneEvitementDevantVaisseau) {
        // collision possible
  
        // calcul de la force d'évitement. C'est un vecteur qui va
        // du centre de l'obstacle vers le point au bout du vecteur ahead
        let force = p5.Vector.sub(pointLePlusProcheDeObstacle, obstacleLePlusProche.pos);
  
        // on le dessine en jaune pour vérifier qu'il est ok (dans le bon sens etc)
        if(Vehicle.debug)
          this.drawVector(obstacleLePlusProche.pos, force, "blue");
  
        // Dessous c'est l'ETAPE 2 : le pilotage (comment on se dirige vers la cible)
        // on limite ce vecteur à la longueur maxSpeed
        // force est la vitesse désirée
        force.setMag(this.maxSpeed);
        // on calcule la force à appliquer pour atteindre la cible avec la formule
        // que vous commencez à connaitre : force = vitesse désirée - vitesse courante
        force.sub(this.vel);
        // on limite cette force à la longueur maxForce
        force.limit(this.maxForce);
  
        if (alerteRougeVaisseauDansObstacle) {
          return force.setMag(this.maxForce * 2);
        } else {
          return force;
        }
  
      } else {
        // pas de collision possible
        return createVector(0, 0);
      }
    }
  
    getObstacleLePlusProche(obstacles) {
      let plusPetiteDistance = 100000000;
      let obstacleLePlusProche = undefined;
  
      obstacles.forEach(o => {
        // Je calcule la distance entre le vaisseau et l'obstacle
        const distance = this.pos.dist(o.pos);
  
        if (distance < plusPetiteDistance) {
          plusPetiteDistance = distance;
          obstacleLePlusProche = o;
        }
      });
  
      return obstacleLePlusProche;
    }
  
    getVehiculeLePlusProche(vehicules) {
      let plusPetiteDistance = Infinity;
      let vehiculeLePlusProche;
  
      vehicules.forEach(v => {
        if (v != this) {
          // Je calcule la distance entre le vaisseau et le vehicule
          const distance = this.pos.dist(v.pos);
          if (distance < plusPetiteDistance) {
            plusPetiteDistance = distance;
            vehiculeLePlusProche = v;
          }
        }
      });
  
      return vehiculeLePlusProche;
    }
  
  
    
    separate(boids) {
      let desiredseparation = this.r;
      let steer = createVector(0, 0, 0);
      let count = 0;
      // On examine les autres boids pour voir s'ils sont trop près
      for (let i = 0; i < boids.length; i++) {
        let other = boids[i];
        let d = p5.Vector.dist(this.pos, other.pos);
        // Si la distance est supérieure à 0 et inférieure à une valeur arbitraire (0 quand on est soi-même)
        if (d > 0 && d < desiredseparation) {
          // Calculate vector pointing away from neighbor
          let diff = p5.Vector.sub(this.pos, other.pos);
          diff.normalize();
          diff.div(d); // poids en fonction de la distance. Plus le voisin est proche, plus le poids est grand
          steer.add(diff);
          count++; // On compte le nombre de voisins
        }
      }
      // On moyenne le vecteur steer en fonction du nombre de voisins
      if (count > 0) {
        steer.div(count);
      }
  
      // si la force de répulsion est supérieure à 0
      if (steer.mag() > 0) {
        // On implemente : Steering = Desired - Velocity
        steer.normalize();
        steer.mult(this.maxSpeed);
        steer.sub(this.vel);
        steer.limit(this.maxForce);
      }
      return steer;
    }
  
    arrive(target, distanceVisee = 0) {
      // 2nd argument true enables the arrival behavior
      return this.seek(target, true, distanceVisee);
    }
  
    seek(target, arrival = false, distanceVisee = 0) {
      let force = p5.Vector.sub(target, this.pos);
      let desiredSpeed = this.maxSpeed;
  
      if (arrival) {
        let slowRadius = 100;
        let distance = force.mag();
        if (distance < slowRadius) {
          desiredSpeed = map(distance, distanceVisee, this.rayonZoneDeFreinage + distanceVisee, 0, this.maxSpeed);
        }
      }
      force.setMag(desiredSpeed);
      force.sub(this.vel);
      force.limit(this.maxForce);
      return force;
    }
  
    // inverse de seek !
    flee(target) {
      return this.seek(target).mult(-1);
    }
  
    /* Poursuite d'un point devant la target !
       cette methode renvoie la force à appliquer au véhicule
    */
    pursue(vehicle) {
      let target = vehicle.pos.copy();
      let prediction = vehicle.vel.copy();
      prediction.mult(10);
      target.add(prediction);
      fill(0, 255, 0);
      circle(target.x, target.y, 16);
      return this.seek(target);
    }
  
    evade(vehicle) {
      let pursuit = this.pursue(vehicle);
      pursuit.mult(-1);
      return pursuit;
    }
  
    // applyForce est une méthode qui permet d'appliquer une force au véhicule
    // en fait on additionne le vecteurr force au vecteur accélération
    applyForce(force) {
      this.acc.add(force);
    }
  
    update() {
      // on ajoute l'accélération à la vitesse. L'accélération est un incrément de vitesse
      // (accélératiion = dérivée de la vitesse)
      this.vel.add(this.acc);
      // on contraint la vitesse à la valeur maxSpeed
      this.vel.limit(this.maxSpeed);
      // on ajoute la vitesse à la position. La vitesse est un incrément de position, 
      // (la vitesse est la dérivée de la position)
      this.pos.add(this.vel);
  
      // on remet l'accélération à zéro
      this.acc.set(0, 0);
  
      // mise à jour du path (la trainée derrière)
      this.ajoutePosAuPath();
  
      // durée de vie
      this.dureeDeVie -= 0.01;


    // si le tableau a plus de 50 éléments, on vire le plus ancien
    if (this.path.length > this.nbMaxPointsChemin) {
      this.path.shift();
    }

    }
  
    ajoutePosAuPath() {
      // on rajoute la position courante dans le tableau
      this.path.push(this.pos.copy());
  
      // si le tableau a plus de 50 éléments, on vire le plus ancien
      if (this.path.length > this.pathMaxLength) {
        this.path.shift();
      }
    }
  
    // On dessine le véhicule, le chemin etc.
    show() {
      // dessin du chemin
      this.drawPath();
      // dessin du vehicule
      this.drawVehicle();
    }
  
    drawVehicle() {
      // formes fil de fer en blanc
      stroke(255);
      // épaisseur du trait = 2
      strokeWeight(2);
  
      // formes pleines
      fill(this.color);
  
      // sauvegarde du contexte graphique (couleur pleine, fil de fer, épaisseur du trait, 
      // position et rotation du repère de référence)
      push();
      // on déplace le repère de référence.
      translate(this.pos.x, this.pos.y);
      // et on le tourne. heading() renvoie l'angle du vecteur vitesse (c'est l'angle du véhicule)
      rotate(this.vel.heading());
  
      // dessin de l'image du vaisseau
      push();
      rotate(PI/2);
      imageMode(CENTER);
      image(this.imageVaisseau, 0, 0, this.r_pourDessin*2, this.r_pourDessin*2);
      pop();
     
      // Dessin d'un véhicule sous la forme d'un triangle. Comme s'il était droit, avec le 0, 0 en haut à gauche
     // triangle(-this.r_pourDessin, -this.r_pourDessin / 2, -this.r_pourDessin, this.r_pourDessin / 2, this.r_pourDessin, 0);
      // Que fait cette ligne ?
      //this.edges();
  
      // draw velocity vector
      pop();
      this.drawVector(this.pos, this.vel, color(255, 0, 0));
  
      // Cercle pour évitement entre vehicules et obstacles
      if (Vehicle.debug) {
        stroke(255);
        noFill();
        circle(this.pos.x, this.pos.y, this.r);
      }
    }
  
    drawPath() {
      push();
      stroke(255);
      noFill();
      strokeWeight(1);
  
      fill(this.color);
      // dessin du chemin
      this.path.forEach((p, index) => {
        if (!(index % 5)) {
  
          circle(p.x, p.y, 1);
        }
      });
      pop();
    }
    drawVector(pos, v, color) {
      push();
      // Dessin du vecteur vitesse
      // Il part du centre du véhicule et va dans la direction du vecteur vitesse
      strokeWeight(3);
      stroke(color);
      line(pos.x, pos.y, pos.x + v.x, pos.y + v.y);
      // dessine une petite fleche au bout du vecteur vitesse
      let arrowSize = 5;
      translate(pos.x + v.x, pos.y + v.y);
      rotate(v.heading());
      translate(-arrowSize / 2, 0);
      triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
      pop();
    }
  
    edges() {
      const buffer = this.r; // Pour éviter que le véhicule ne "rebondisse" à la position limite
      this.pos.x = constrain(this.pos.x, buffer, width - buffer);
      this.pos.y = constrain(this.pos.y, buffer, height - buffer);
    }
  }
  
  class Target extends Vehicle {
    constructor(x, y) {
      super(x, y);
      this.vel = p5.Vector.random2D();
      this.vel.mult(5);
    }
  
    show() {
  push();
  stroke(255);
  strokeWeight(2);
  fill("#00FF00"); // Corrected line
  translate(this.pos.x, this.pos.y);
  circle(0, 0, this.r * 2);

  // Draw a line representing the "souris" (mouse) on the head of the vehicle
  let mousePos = createVector(0, -this.r * 2);
  stroke("#00FF00");
  line(0, 0, mousePos.x, mousePos.y);

  pop();
}
  }