const canvas = document.getElementById('canvas1');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 

//Collision Canvas

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionContext = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight; 

//Time to next raven will be used to track the amount of time that has past since the last raven was created;
let timeToNextRaven = 0; 

//RavenInterval will be used to create a new raven when timeToNext raven and it becomes equal;
let ravenInterval = 500;
//LastTime will be used to keep track of timestamp from the previous loop
let lastTime = 0;

let ravens = [];
let score  = 0;
context.font = "50px impact";
let gameOver = false; 

class Raven {
    constructor(){
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.3;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        //this is used to check if a raven should be deleted for the ravens array because it is no longer on screen 
        this.markForDeletion = false;
        this.image= new Image();
        this.image.src = 'raven.png';
        //used to track current frame
        this.frame = 0; 
        //the amount of frames in sprite sheet 
        this.maxFrame = 4;
        //use track time betwwen frames
        this.timeSinceFlap = 0;
        //use to randomize frame changing speeed;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
        
    }

    update(deltaTime){

        if(this.y < 0 || this.y > canvas.height - this.height){
            this.directionY = this.directionY * -1;
        }
        //This line of code allows the enemy to move from one side of the screen to the next in this instance it will be from right to left. 
        this.x -= this.directionX;
        this.y += this.directionY;
        if(this.x < 0 - this.width)this.markForDeletion = true;
        //delta time is the time betwwen animate loops;
        this.timeSinceFlap += deltaTime
        //this controls howfast frames are changed;
        if(this.timeSinceFlap > this.flapInterval){
            //this changes the frame 
        if(this.frame > this.maxFrame) this.frame = 0;
        else this.frame++;
        //reset this to zero the allow new count per raven
        this.timeSinceFlap = 0;
        }
        if(this.x < 0 - this.width) gameOver = true;
    }
    draw(){
        collisionContext.fillStyle = this.color;
        collisionContext.fillRect(this.x,this.y,this.width,this.height);
        context.drawImage(this.image,this.spriteWidth * this.frame,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
    }
}

let explosion = []; 
class Explosion {
    constructor(x,y,size){
        this.image = new Image();
        this.image.src = 'boom.png';
        this.spriteWidth = 200; 
        this.spriteHeight = 179; 
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0; 
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 100;
        this.markForDeletion = false;
    }
    update(deltaTime){
        if(this.frame == 0) this.sound.play();
        this.timeSinceLastFrame += deltaTime;
        if(this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame = 0;
            if(this.frame > 5){
                this.markForDeletion = true;
            }
        }
        
    }
    draw(){
        context.drawImage(this.image,this.spriteWidth * this.frame,0,this.spriteWidth,this.spriteHeight,this.x,this.y - this.size/4,this.size,this.size);
    }
}

function drawScore(){
    context.fillStyle = "black";
    context.fillText("Score: " + score, 50, 75);
    context.fillStyle = 'white';
    context.fillText('Score: ' + score, 55,80);
}

function drawGameOver(){
    context.textAlign = 'center';
    context.fillStyle = 'black';
    context.fillText('Game Over, your score is ' + score, canvas.width/2,canvas.height/2);
    context.fillStyle = 'white';
    context.fillText('Game Over, your score is ' + score, canvas.width/2 + 5,canvas.height/2 + 5);
}

window.addEventListener('click', function(e){
    console.log(e.x,e.y);
    const detectPixelColor = collisionContext.getImageData(e.x,e.y,1,1);
    console.log(detectPixelColor);
    const pc = detectPixelColor.data;
    ravens.forEach(object => {
        if(object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]){
            object.markForDeletion = true;
            score++;
            explosion.push(new Explosion(object.x,object.y,object.width));
            console.log(explosion);
        }
    })
})


function animate(timestamp){
    context.clearRect(0,0,canvas.width,canvas.height);
    collisionContext.clearRect(0,0,canvas.width,canvas.height);
    //delta time is use to calculate the amount of milliseconds between current loop and next loop;
    deltaTime = timestamp - lastTime;
    lastTime = timestamp; 
    timeToNextRaven += deltaTime;
    if(timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort(function(a,b){
            return a.width - b.width;
        })
    }
    drawScore();
    [...ravens,...explosion].forEach(object => object.update(deltaTime));
    [...ravens,...explosion].forEach(object => object.draw());

    // this line recreates the raven array and filters out ravens that have markedfordeletion not set to true which means they are on screen.
    ravens = ravens.filter(object => !object.markForDeletion);
    explosion = explosion.filter(object => !object.markForDeletion);
    // !!the line below passes a timestamp to the animate function by defaut.!!
    if(!gameOver)requestAnimationFrame(animate);
    else drawGameOver();
}
animate(0);