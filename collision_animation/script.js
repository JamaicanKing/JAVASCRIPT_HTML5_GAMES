const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;
//check it canvas is working
/*
ctx.fillStyle = 'white';
ctx.fillRect(50,50,100,150);
*/

//Create explosion class to  hold all active explosion object i create 
const explosion = [];

let canvasPosition = canvas.getBoundingClientRect();



//The explosion objects will be created using Explosion class
class Explosion {
    //constructor expects X and Y coordinates to know exactly where on  canvas the animation  should  be;
    constructor(x,y){
         
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.width = this.spriteWidth * 0.7;
        this.height = this.spriteHeight * 0.7;
        this.x  =  x - this.width/2;
        this.y = y - this.height/2;
        this.image =  new Image();
        this.image.src = "boom.png";
        this.frame = 0;
        this.timer = 0;
    }
   
    //Update method is used to loop through frame in the sprite sheet 
    update(){
        this.timer++;
        if(this.timer % 10 === 0){
            this.frame++;
       }
    }
    draw(){
        ctx.drawImage(this.image,this.spriteWidth * this.frame,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
    }
}

window.addEventListener('mousemove', function(e){
    createAnimation(e);
})

function createAnimation(e){
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    explosion.push(new Explosion(positionX,positionY));
}

function animate(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    for(let i = 0; i < explosion.length;i++){
        explosion[i].update();
        explosion[i].draw();
        if(explosion[i].frame > 5){
            explosion.splice(i,1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}
animate();


