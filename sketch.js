var reximg,trex,groundimg,ground,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6,clouds,CloudsGroup,ObstaclesGroup,count,gameover,restarting,PLAY = 1,END = 0,gameState = PLAY,trexcollider,invisibleGround,jump,die,checkpoint


function preload(){
  reximg=loadAnimation("trex1.png","trex3.png","trex4.png");
  groundimg = loadImage("ground2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  clouds = loadImage("cloud.png");
  gameover = loadImage("gameOver.png");
  restarting = loadImage("restart.png");
  trexcollider = loadAnimation("trex_collided.png");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
}


function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180);
  trex.addAnimation("trex",reximg);
  trex.addAnimation("trexs",trexcollider);
  trex.scale = 0.5;
  ground = createSprite(600,185);
  ground.addImage("ground",groundimg);
  ground.velocityX = -4;
  invisibleGround = createSprite(0,190,110,13);
  invisibleGround.visible = false;  
  
  restarts = createSprite(300,120);
  restarts.scale = 0.5;
  gameovers = createSprite(300,110);
  restarts.addImage("restartes",restarting);
  gameovers.addImage("gameoveer",gameover);
  restarts.visible = false;
  gameovers.visible = false;

  CloudsGroup = createGroup();
  ObstaclesGroup = createGroup();
  
  count = 0;
  
trex.debug = true;                                     
}

function draw() {
  //set background to white
  background("white");
  //display score
  text("Score: "+ count, 520, 35);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    //scoring
    count = count+Math.round(getFrameRate()/60);
    
    if (count>0 && count%100 === 0){
      checkpoint.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >=150){
      trex.velocityY = -12 ;
      jump.play(); 
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
      die.play();
    }
  }
  
  else if(gameState === END) {
    gameovers.visible = true;
    restarts.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("trexs",trexcollider);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restarts)) {
    reset();
  }
  
  //console.log(trex.y);
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach(); 
  gameovers.visible = false;
  restarts.visible = false;
  count = 0;
  trex.changeAnimation("trex",reximg);
  
  
  
}


function spawnObstacles() {
  if(World.frameCount % 60 === 0) {
    var obstacle = createSprite(600,168,10,40);
    obstacle.velocityX = -6
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1 : obstacle.addImage(obstacle1);
      break 
       case 2 : obstacle.addImage(obstacle2);
      break 
       case 3 : obstacle.addImage(obstacle3);
      break 
       case 4 : obstacle.addImage(obstacle4);
      break 
       case 5 : obstacle.addImage(obstacle5);
      break 
       case 6 : obstacle.addImage(obstacle6);
      break 
           }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (World.frameCount % 60 === 0) {
    var cloud = createSprite(600,104903148,40,10);
    cloud.y = Math.round(random(10,100));
    cloud.addImage("cloudss",clouds);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}
