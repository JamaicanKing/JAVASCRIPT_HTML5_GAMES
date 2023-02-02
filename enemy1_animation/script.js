/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const numberOfEnemies = 100;
const enemiesArray = [];

let gameFrame = 0;

class Enemy{
    constructor(){
        this.image = new Image();
        this.image.src = 'enemy1.png';
        this.spriteWidth = 293; 
        this.spriteHeight = 155;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.frame= 0; 
        this.flapSpeed = Math.floor(Math.random() * 3 + 1); 
    }
    update(){
        this.x += Math.random() * 5 - 2.5;
        this.y += Math.random() * 5 - 2.5;
        //this line is used to controll the flap speed of each enemy
        if(gameFrame % this.flapSpeed == 0){
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }

    draw(){
        ctx.drawImage(this.image,this.frame * this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height)
    }

}

//this loop creates each enemy 
for(let i = 0; i < numberOfEnemies; i++){
    enemiesArray.push(new Enemy());
}

function animate(){
    //ctx.clearRect() removes old paint from canvas;
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    //this loop updates the the location of the pixels on the screen and the redraws each time while looping through each game frame;
    enemiesArray.forEach(enemy => {
        enemy.update();
        enemy.draw();
    });
    //helps control flapspeed;
    gameFrame++;
    requestAnimationFrame(animate);
};
//initiate the first loop;
animate();