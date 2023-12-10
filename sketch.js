//sketch
let pursuer1, pursuer2;
  let target;
  let obstacles = [];
  let vehicules = [];
  let vehicle;
  let cibles = [];
  let demo = "snake";
  
  let sourisRougePosition;
  
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
   
    sourisRougePosition = createVector(mouseX, mouseY);
  // Create sliders
  maxSpeedSlider = createSlider(1, 10, 4, 0.1); // Adjust the range and default value as needed
  maxForceSlider = createSlider(0.1, 2, 0.7, 0.1); // Adjust the range and default value as needed
  distanceAheadSlider = createSlider(10, 100, 30, 1); // Adjust the range and default value as needed
// Position the sliders on the canvas
maxSpeedSlider.position(10, height + 10);
maxForceSlider.position(10, height + 40);
distanceAheadSlider.position(10, height + 70);
 

  }
  
  
  function draw() {
    // changer le dernier param (< 100) pour effets de trainée
    background(0, 0, 0, 100);
  
    target = createVector(mouseX, mouseY);

// Update parameters based on slider values
pursuer1.maxSpeed = maxSpeedSlider.value();
pursuer1.maxForce = maxForceSlider.value();
pursuer1.distanceAhead = distanceAheadSlider.value();
    

    // Dessin de la cible qui suit la souris
    // Dessine un cercle de rayon 32px à la position de la souris
    fill(255, 0, 0);
    noStroke();
    circle(target.x, target.y, 32);
   
    // Dessin du cercle blanc qui entoure la souris
    fill(255);
    noFill();
    stroke(255);
    circle(target.x, target.y, 100);
  
    // dessin des obstacles
    // TODO
    obstacles.forEach(o => {
      o.show();
    })

      // Mettez à jour la position de la souris rouge
  sourisRougePosition = createVector(mouseX, mouseY);

  // Dessinez la petite souris verte sur le premier véhicule
  vehicules[0].drawMouse(sourisRougePosition);
  


    switch (demo) {

 case "random":
      // Afficher et mettre à jour les véhicules en mode aléatoire
      vehicules.forEach(vehicle => {
        let forceArrive = vehicle.applyBehaviors(target, obstacles, vehicules, 0);
  vehicle.update();
        vehicle.show();
      });
      break;

    case "snake":
      vehicules.forEach((vehicle, index) => {
        let forceArrive;
        vehicle.poidsSeparation = 0;
  
        if (index == 0) {
          // C'est le 1er véhicule, il suit la cible/souris
          forceArrive = vehicle.applyBehaviors(target, obstacles, vehicules, 0);
        } else{
          // les véhicules suivants suivent le véhicule précédent
          let vehiculePrecedent = vehicules[index - 1];
  
          forceArrive = vehicle.applyBehaviors(vehiculePrecedent.pos, obstacles, vehicules, 40);
        }
        
  
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
    // quand on vas cliquer sur la lettre a il vas debuger 
    if (key == "a") {
      Vehicle.debug = !Vehicle.debug; 
    }
    if(key == "l"){
       demo = "snake";
    }
    if (key == "d") {
      Vehicle.debug = !Vehicle.debug;
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
    }}
   
  