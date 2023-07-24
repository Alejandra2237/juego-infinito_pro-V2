var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground,  back, invisibleGround, groundImage;

var logosGroup, avion;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg, fondoImage;
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;
var points = 0;


function preload(){
  jumpSound = loadSound("jump.wav");
  collidedSound = loadSound("collided.wav");
  
  fondoImage = loadImage("backgroundImg.png");
  //backgroundImg = loadImage("bg_dia.png");
  backgroundImgN = loadImage("Bgfinalfuture.png");
  //sunAnimation = loadImage("sun.png");
  
  trex_running = loadAnimation("Byjusaurio01.png","Byjusaurio02.png");
  //trex_jump = loadAnimation("astronautabyjus01.png");
  trex_collided = loadAnimation("Byjusaurio03.png");
  
  //groundImage = loadImage("ground.png");
  
  //cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("botee.png");
  obstacle2 = loadImage("cabina.png");
  obstacle3 = loadImage("hydre.png");
  logo1 = loadImage("cocacolalogo.png");
  logo2 = loadImage("kellogslogo.png");
  logo3 = loadImage("kidzanialogo.png");
  logo4 = loadImage("logostomar02.png");
  logo5 = loadImage("logotomar1.png");
  logo6 = loadImage("nissanlogo.png");
  
  gameOverImg = loadImage("gameOver.png");
  //restartImg = loadImage("restart.png");
  avion = loadImage("avion.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  /*sun = createSprite(width-50,80,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.15*/

  back = createSprite(width/2,height/3+30,width,height);
  //back.addImage("back", backgroundImg);
  back.addImage("backN", backgroundImgN);
  back.x = width/2+2390;
  back.velocityX = -(6 + 3*score/500);

  trex = createSprite(50,height-200,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  //trex.addAnimation("jump", trex_jump);
  trex.setCollider('circle',0,0,350)
  trex.scale = 0.13
  // trex.debug=true
  
  invisibleGround = createSprite(width/2,height,width,100);  
  invisibleGround.shapeColor = "#f4cbaa";
  //invisibleGround.velocityX = -(6 + 3*score/500);
  

  /*ground = createSprite(width/2,height,width,2);
  //ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);*/
  
  /*restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);*/
  
  
  //restart.scale = 0.1;

  //restart.visible = false;
  
 
  invisibleGround.visible =false

  logosGroup = new Group();
  obstaclesGroup = new Group();
  planesGroup = new Group();

  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background("#3c118d");
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    //ground.velocityX = -(6 + 3*score/500);
    back.velocityX = -(6 + 3*score/500);

    //if(score <= 199){
      //back.addImage(backgroundImgN);
   /* }
    if (score % 200 === 0) {
      
      var rand = Math.round(random(1,2));
      switch(rand) {
        case 1: back.addImage(backgroundImg);
        break;
        case 2: back.addImage(backgroundImgN);
        break;
        default: break;
      }
  
    }*/

    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
      jumpSound.play( )
      trex.velocityY = -10;
      //trex.changeAnimation("jump", trex_jump);
       touches = [];
    } 
    
    trex.velocityY = trex.velocityY + 0.8
  
    /*if (ground.x < 0){
      ground.x = ground.width/2;
    }*/

    if (back.x < -1600){
      back.x = back.width/2;
    }
  
    trex.collide(invisibleGround);
    
    spawnObstacles();
    spawnLogos();
    spawnPlane();

    if(logosGroup.isTouching(trex)){
      points = points+1;
      logosGroup.destroyEach();
    }

    if(obstaclesGroup.isTouching(trex)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    //restart.visible = true;
    
    //establecer velocidad para cada objeto del juego en 0
    //ground.velocityX = 0;
    back.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    logosGroup.setVelocityXEach(0);
    planesGroup.setVelocityXEach(0);
    
    //cambiar la animación del trex
    trex.changeAnimation("collided",trex_collided);
    
    //establecer tiempo de vida a los objetos del juego para que nunca se destruyan.
    obstaclesGroup.setLifetimeEach(-1);
    logosGroup.setLifetimeEach(-1);
    planesGroup.setLifetimeEach(-1);
    
    if(touches.length > 0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }

  drawSprites();
  textSize(20);
  fill("yellow")
  text("Tiempo: "+ score,30,50);
  fill("white");
  text("Puntos: "+ points,30,80);
}

function spawnPlane() {
  //escribir código aquí para aparecer nubes.
  if (frameCount % 400 === 0) {
    var plane = createSprite(width+20,height-300,40,10);
    plane.y = Math.round(random(50,250));
    plane.addImage(avion);
    plane.scale = 0.5;
    plane.velocityX = -(6 + 3*score/500);
    
     //asignar tiempo de vida a la variable
    plane.lifetime = 300;
    
    //ajustar la profundidad.
    plane.depth = gameOver.depth;
    plane.depth -=1;
    
    //agregar cada nube a un grupo.
    planesGroup.add(plane);
  }
  
}

function spawnLogos() {
  //escribir código aquí para aparecer logos.
  if (frameCount % 150 === 0) {
    var logo = createSprite(width+20,height-190,40,10);
    //logo.addImage(cloudImage);
    logo.scale = 0.08;
    logo.velocityX = -(6 + 3*score/500);

    //generar logos  aleatorios.
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: logo.addImage(logo1);
              break;
      case 2: logo.addImage(logo2);
              break;
      case 3: logo.addImage(logo3);
              break;
      case 4: logo.addImage(logo4);
              break;
      case 5: logo.addImage(logo5);
              break;
      case 6: logo.addImage(logo6);
              break;
      default: break;
    }
    
     //asignar tiempo de vida a la variable
    logo.lifetime = 300;
    
    //ajustar la profundidad.
    logo.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //agregar cada nube a un grupo.
    logosGroup.add(logo);
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {
    var obstacle = createSprite(width,height-80,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/500);
    
    //generar obstáculos aleatorios.
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
    
    //asignar tamaño y tiempo de vida al obstáculo.           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //agregar cada obstáculo a cada grupo.
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  //restart.visible = false;
  
  obstaclesGroup.destroyEach();
  logosGroup.destroyEach();
  planesGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  points = 0;
  
}
