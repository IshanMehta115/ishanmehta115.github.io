const canvas = document.getElementById("game_canvas");
const ctx = canvas.getContext("2d")

var speed = 7;
var tileSize = 20;

var headX;
var headY;

var xVel;
var yVel;

var appleX;
var appleY;

const sound = new Audio("beep.wav");

var interval;

class snakeParts{
    constructor(x,y){
        this.x = x ;
        this.y = y;
    }
}

const body = [];
var body_length;
var score;


function reset_game(){
    body_length=0;
    score=0;
    while(body.length>0)
        body.pop();
    headX=10;
    headY=10;
    yVel=0;
    xVel=0;
    appleX = Math.floor(Math.random()*tileSize);
    appleY = Math.floor(Math.random()*tileSize);
    while(appleX==headX && appleY==headY){
        appleX = Math.floor(Math.random()*tileSize);
        appleY = Math.floor(Math.random()*tileSize);
    }   
}
function drawGame(){
    changeSnakePosition();
    if(isGameOver()){
        stop_game();
        display_gameOver();
        setTimeout(start_game,2000);
    }
    else{
        clearScreen();
        checkAppleCollision();
        drawApple();
        drawSnake();
        drawScore();
    }
}

function clearScreen(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width , canvas.height);
}

function drawSnake(){
    ctx.fillStyle="GreenYellow";
    ctx.fillRect(headX*tileSize,headY*tileSize,tileSize,tileSize);

    for(var i=0;i<body.length;i++){
        var part = body[i];
        ctx.fillRect(part.x*tileSize,part.y*tileSize,tileSize,tileSize);
    }

    body.push(new snakeParts(headX,headY));
    while(body.length>body_length){
        body.shift();
    }
}

function drawApple(){
    ctx.fillStyle="Red";
    ctx.fillRect(appleX*tileSize,appleY*tileSize,tileSize,tileSize);
}

function drawScore(){
    ctx.fillStyle="white";
    ctx.font = "20px verdana";
    ctx.fillText("Score "+score,canvas.width-100,25);
}

function changeSnakePosition(){
    headX = headX + xVel;
    headY = headY + yVel;
}

function checkAppleCollision(){
    if(appleX==headX && appleY==headY){
        appleX = Math.floor(Math.random()*tileSize);
        appleY = Math.floor(Math.random()*tileSize);
        body_length = body_length+1;
        score = score + 1;
        sound.play();
    }
}

document.body.addEventListener("keydown",keyDown);


function isGameOver(){
    
    if(headX<0)
    return true;
    if(headY<0)
    return true;
    if(headX>=20)
    return true;
    if(headY>=20)
    return true;
    for(var i = 0;i<body.length;i++){
        var part = body[i];
        if(part.x==headX && part.y==headY)
            return true;
    }
    return false;
}

function display_gameOver(){
    ctx.fillStyle = "White";
    ctx.font = "50px verdana";
    ctx.fillText("GAME OVER",canvas.width/6,canvas.height/2);
}
function keyDown(event){
    // up 
    if(event.keyCode == 38){
        if(yVel==1)
        return;
        xVel=0;
        yVel=-1;
    }

    // down
    if(event.keyCode == 40){
        if(yVel==-1)
        return;
        xVel=0;
        yVel=1;
    }

    //right
    if(event.keyCode == 39){
        if(xVel==-1)
        return;
        xVel=1;
        yVel=0;
    }

    //left
    if(event.keyCode == 37){
        if(xVel==1)
        return;
        xVel=-1;
        yVel=0;
    }
}

function start_game(){
    reset_game();
    interval = setInterval(drawGame,1000/speed);
}
function stop_game(){
    clearInterval(interval);
}
start_game();