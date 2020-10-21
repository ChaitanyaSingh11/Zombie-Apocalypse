// Creating character variables
var girl, girl_run, girl_shoot, girl_jump1, girl_jump2;
var bullet, bulletImg, bulletGroup;
var zombie, zombieImg, zombieGroup;
// Creating button variables
var play1, play2, play;
var restart1, restart2, restart;
// Creating bg image variables
var bgintro, bgimg;
// Creating ground and platforms variables
var groundImg, ground1, ground2, invisible_ground;
var floatingtile, floatingtileImg;
var platformImg,  platform;
// Setting the gameState and Score
var gameState = "intro";
var score = 0;
// Creating obstacles variables
var crateimg, crate, grave, grave1, grave2, skeletonimg, skeleton, obstacleGroup;
// Random Numbers Variables
var rand1 = 0;
// creating scoring system
var score = 0,
    scoreImg, zombscore;
//adding sounds
var bgsound, gunsound, dead;

function preload() {
    // Loading Girl's Images
    girl_run = loadAnimation("Run (1).png", "Run (2).png", "Run (3).png", "Run (4).png", "Run (5).png", "Run (6).png", "Run (7).png", "Run (8).png");
    girl_shoot = loadImage("Shoot (1).png");
    girl_jump1 = loadImage("Jump (4).png");
    girl_jump2 = loadImage("Jump (5).png");
    bulletImg = loadImage("Bullet1.png");
    // Loading zombie Animation
    zombieImg = loadAnimation("Idle (1).png", "Idle (2).png", "Idle (3).png", "Idle (4).png", "Idle (5).png", "Idle (6).png", "Idle (7).png", "Idle (8).png", "Idle (9).png", "Idle (10).png", "Idle (11).png", "Idle (12).png", "Idle (13).png", "Idle (14).png", "Idle (15).png");
    // Loading buttons' images
    play1 = loadImage("play1.png");
    play2 = loadImage("play2.png");
    restart1 = loadImage("restart1.png");
    restart2 = loadImage("restart2.png");
    // Loading bg images
    bgintro = loadImage("intro1.jpg");
    bgimg = loadImage("bg.png");
    // Loading ground and platforms' Images
    groundImg = loadImage("Floor Tile.png");
    floatingtileImg = loadImage("Floating Tile.png");
    platformImg = loadImage("Platform.png");
    // Loading Obstacles Images
    crateimg = loadImage("Crate.png");
    grave1 = loadImage("Tombstone (1).png");
    grave2 = loadImage("Tombstone (2).png");
    skeletonimg = loadImage("Skeleton.png");
    // loading score image
    scoreImg = loadImage("Idle (1).png");
    // loading sounds
    bgsound = loadSound("spooky.mp3");
    gunsound = loadSound("gun.mp3");
    dead = loadSound("dead.mp3");
}

function setup() {
    createCanvas(900, 600);

    ground1 = createSprite(900, 414);
    ground1.addImage("groundImg", groundImg);

    ground2 = createSprite(2695, 414);
    ground2.addImage("groundImg", groundImg);

    invisible_ground = createSprite(900, 485, 1800, 10);
    invisible_ground.visible = false;

    girl = createSprite(100, 380);
    girl.addAnimation("girl_run", girl_run);
    girl.addImage("girl_shoot", girl_shoot);
    girl.addImage("girl_jump1", girl_jump1);
    girl.addImage("girl_jump2", girl_jump2);
    girl.scale = 0.375;
    girl.frameDelay = 3;
    girl.setCollider("rectangle", 0, 0, 200, 500);

    play = createSprite(450, 300);
    play.addImage("play1", play1);
    play.addImage("play2", play2);
    play.scale = 0.5;

    restart = createSprite(450, 310);
    restart.addImage("restart1", restart1);
    restart.addImage("restart2", restart2);
    restart.scale = 0.5;

    zombscore = createSprite(50, 75);
    zombscore.addImage("scoreImg", scoreImg);
    zombscore.scale = 0.2;
    zombscore.visible = false;
    obstacleGroup = new Group();
    zombieGroup = new Group();
    bulletGroup = new Group();
    bgsound.loop();
}

function draw() {
    // Intro Page of the Game
    if (gameState == "intro") {
        background(bgintro);
        scoreImg.visible = false;
        score = 0;
        girl.visible = false;
        girl.x = 100;
        girl.y = 300;
        girl.velocityX = 0;
        ground1.visible = false;
        ground2.visible = false;
        restart.visible = false;
        zombscore.visible = false;
        play.visible = true;
        if (mouseWentDown("left") && mousePressedOver(play)) {
            play.changeImage("play2", play2);

        } else if (mouseWentUp("left") && mouseIsOver(play)) {
            play.changeImage("play1", play1);
            gameState = "play";
        }
    }

    // Play state of the game
    if (gameState == "play") {
        background(bgimg);
        zombscore.visible = true;
        ground1.visible = true;
        ground1.velocityX = -8.5;
        ground2.visible = true;
        ground2.velocityX = -8.5;
        if (ground1.x < -900)
            ground1.x = 2690;
        if (ground2.x < -900)
            ground2.x = 2695;
        play.visible = false;
        girl.visible = true;
        obstacleGroup.collide(invisible_ground);
        if (zombieGroup.isTouching(bulletGroup)) {
            zombieGroup.destroyEach();
            dead.play();
            score++;
        }
        if (girl.isTouching(zombieGroup))
            gameState = "over";
        obstacles();
        controls();
        shoot();
        textSize(30);
        fill("Yellow");
        text("-  " + score, 100, 100);
    }


    if (girl.x < -100)
        gameState = "over";

    // Gamestate Over
    if (gameState == "over") {
        bulletGroup.destroyEach();
        girl.visible = false;
        restart.changeImage("restart1", restart1);
        obstacleGroup.destroyEach();
        zombieGroup.destroyEach();
        ground1.velocityX = 0;
        ground2.velocityX = 0;
        scoreImg.visible = false;
        restart.visible = true;
        if (mouseWentDown("left") && mousePressedOver(restart) && gameState == "over") {
            restart.changeImage("restart2", restart2);
        } else if (mouseWentUp("left") && mouseIsOver(restart) && gameState == "over") {
            play.changeImage("restart1", restart1);
            gameState = "intro";
        }
    }
    drawSprites();

}

function controls() {
    if (girl.collide(invisible_ground) | girl.collide(obstacleGroup))
        girl.changeAnimation("girl_run", girl_run);
    girl.velocityY++;
    if (keyWentDown("space") && girl.y > 200) {
        girl.velocityY = -15;
    }
    if (girl.velocityY < 0)
        girl.changeImage("girl_jump1", girl_jump1);
    if (girl.velocityY > 1)
        girl.changeImage("girl_jump2", girl_jump2);
}

function obstacles() {
    rand1 = Math.round(random(2, 4));
    rand2 = Math.round(random(1, 2));
    if (World.frameCount % (rand1 * 100) == 0) {
        crate = createSprite(1500, 430);
        crate.addImage("crateimg", crateimg);
        crate.velocityX = -8.5;
        if (crate.x < -10)
            crate.destroy();
        obstacleGroup.add(crate);
    }

    if (World.frameCount % ((rand1 + 1) * 100) == 0) {
        grave = createSprite(1000, 440);
        switch (rand2) {
            case 1:
                grave.addImage("grave1", grave1);
                break;
            case 2:
                grave.addImage("grave2", grave2);
                break;
        }
        grave.velocityX = -8.5;
        if (grave.x < -10)
            grave.destroy();
        obstacleGroup.add(grave);
    }

    if (World.frameCount % 600 == 0) {
        platform = createSprite(2000, 410);
        platform.addImage("platformImg", platformImg);
        platform.velocityX = -8.5;
        if (platform.x < -10)
            platform.destroy();
        obstacleGroup.add(platform);

        skeleton = createSprite(2000, 320);
        skeleton.addImage("skeeltonimg", skeletonimg);
        skeleton.velocityX = -8.5;
        skeleton.scale = 1.5;
        skeleton.setCollider("rectangle", 0, 0, 10, 10);
        obstacleGroup.add(skeleton);


        zombie = createSprite(skeleton.x - 20, 260);
        zombie.addAnimation("zombieImg", zombieImg);
        zombie.frameDelay = 2;
        zombie.scale = 0.375;
        zombie.velocityX = -8.5;
        zombie.collide(invisible_ground);

        zombieGroup.add(zombie);

        floatingtile = createSprite(platform.x + 410, 300);
        floatingtile.addImage("floatingtileImg", floatingtileImg);
        floatingtile.velocityX = -8.5;
        if (floatingtile.x < -10)
            floatingtile.destroy();
        floatingtile.setCollider("rectangle", 0, -40, 400, 10);
        obstacleGroup.add(floatingtile);

    }
}

function shoot() {
    if (keyWentDown("l")) {
        gunsound.play();
        bullet = createSprite(girl.x, girl.y);
        bullet.addImage("bulletImg", bulletImg);
        bullet.velocityX = 10;
        bullet.lifetime = 100;
        girl.changeImage("girl_shoot", girl_shoot);
        bullet.depth = girl.depth;
        girl.depth++;
        bulletGroup.add(bullet);
        console.log(bullet.x);
    }
}