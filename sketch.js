let pursuer1, pursuer2;
let target;
let obstacles = [];
let vehicules = [];
let vehicle;
let cibles = [];
let demo = "snake";

let imgVaisseau;

function preload() {
  console.log("preload")
  imgVaisseau = loadImage('assets/images/vaisseau.png');
}

function setup() {
  console.log("setup")
  createCanvas(windowWidth, windowHeight);
  pursuer1 = new Vehicle(100, 100, imgVaisseau);
  pursuer2 = new Vehicle(random(width), random(height), imgVaisseau);

  vehicules.push(pursuer1);
  vehicules.push(pursuer2);

  // On cree un obstace au milieu de l'écran
  // un cercle de rayon 100px
  // TODO
  obstacles.push(new Obstacle(width / 2, height / 2, 100));
}

function draw() {
  // changer le dernier param (< 100) pour effets de trainée
  background(0, 0, 0, 100);

  target = createVector(mouseX, mouseY);

  // Dessin de la cible qui suit la souris
  // Dessine un cercle de rayon 32px à la position de la souris
  fill(255, 0, 0);
  noStroke();
  circle(target.x, target.y, 32);

  // dessin des obstacles
  // TODO
  obstacles.forEach(o => {
    o.show();
  })
  switch (demo) {
    
  case "snake":
    vehicules.forEach((vehicle, index) => {
      let forceArrive;

      if (index == 0) {
        // C'est le 1er véhicule, il suit la cible/souris
        forceArrive = vehicle.arrive(target);
      } else{
        // les véhicules suivants suivent le véhicule précédent
        let vehiculePrecedent = vehicules[index - 1];

        forceArrive = vehicle.arrive(vehiculePrecedent.pos, 40);

      }
      // On applique la force au véhicule
      vehicle.applyForce(forceArrive);

      vehicle.update();
      vehicle.show();
    });
    break;

  }

 
}
function mousePressed() {
  // TODO : ajouter un obstacle de taille aléatoire à la position de la souris
  obstacles.push(new Obstacle(mouseX, mouseY, random(30, 100)));

}




function keyPressed() {
  // quand on clique sur la lettre v il nous ajoute une seule vehicule.
  if (key == "v") {
    vehicules.push(new Vehicle(random(width), random(height), imgVaisseau));
  }
  if (key == "d") {
    Vehicle.debug = !Vehicle.debug;
  }
  if(key == "s"){
     demo = "snake";
  }

  //quand on clique sur la lettre f il nous ajoute plusieur vehicules.
  if (key == "f") {
    // Je cree 100 vehicules qui partent du bord gauche de l'écran
    // et qui vont vers la cible/souris
    for (let i = 0; i < 10; i++) {
      let v = new Vehicle(random(10, 20), random(height/2 -10,height/2 +10 ), imgVaisseau)
      v.maxSpeed = 10;
      v.color = "purple";
      vehicules.push(v);
    }
  }
}