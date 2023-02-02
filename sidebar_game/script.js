window.addEventListener('load',function(){
    const canvas = document.getElementById('canvas1');
    const context = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 720; 
    let enemies = [];
    let score = 0;
    let gameOver = false;

    class InputHandler{
        constructor(){
            //store keys that were pressed
            this.keys = [];
            window.addEventListener('keydown',e =>{
                if((e.key === "ArrowDown" || 
                e.key === "ArrowUp" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight" )
                && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                }
            });

            window.addEventListener('keyup',e =>{
                if(e.key === "ArrowDown" ||
                e.key === "ArrowUp" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight"){
                    this.keys.splice(this.keys.indexOf(e.key),1);
                }
            });
        }
    }

    class Player {
        constructor(gameWidth,gameHeight){
            this.Image = document.getElementById('playerImage');
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.playerWidth = 200;
            this.playerHeight = 200; 
            this.x = 0;
            this.y = this.gameHeight - this.playerHeight;
            this.frameX = 0; 
            this.frameY = 0;
            this.maxFrame = 8; 
            this.fps = 20;
            this.frameTimer = 0; 
            this.frameInterval = 1000/this.fps;
            this.speed = 0;
            this.vy = 0;
            this.gravity = 1;
            
        }

        draw(context){
            context.drawImage(this.Image,this.frameX * this.playerWidth,this.frameY * this.playerHeight,this.playerWidth,this.playerHeight,this.x,this.y,this.playerWidth,this.playerHeight);
        }
        update(input,deltaTime,enemies){
            //collision Detection 
            enemies.forEach(enemy => {
                const dx = (enemy.x + enemy.enemeyWidth/2) - (this.x + this.playerWidth/2);
                const dy = (enemy.y + enemy.enemyHeight)- (this.y + this.playerHeight/2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                if(distance < enemy.enemeyWidth/2 + this.playerWidth/2){
                    gameOver = true;
                }
            })
            //sprite Animation 
            if(this.frameTimer > this.frameInterval){
                if(this.frameX >= this.maxFrame) this.frameX = 0
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            //controls
            if(input.keys.indexOf('ArrowRight') > -1){
                this.speed = 5;
            }else if(input.keys.indexOf('ArrowLeft') > -1){
                this.speed = -5;
            }else if(input.keys.indexOf('ArrowUp') > -1 && this.OnGround()){
                this.vy -= 32;
            }else {
                this.speed = 0;
            }

            //horizontal movement
            this.x += this.speed;
            if(this.x < 0) this.x = 0;
            else if(this.x >  this.gameWidth - this.width) this.x = this.gameWidth - this.width;
            //vertical movement
            this.y += this.vy;
            if(!this.OnGround()){
                this.vy += this.gravity;
                this.maxFrame = 5;   
                this.frameY = 1;
            }else {
                this.vy = 0;
                this.maxFrame = 8; 
                this.frameY = 0;
            }
            if(this.y > this.gameHeight - this.playerHeight) this.y = this.gameHeight - this.playerHeight;
        }
        OnGround(){
            return this.y >= this.gameHeight - this.playerHeight;
        }
        
    }

    class Background{
        constructor(gameWidth,gameHeight){
            this.gameHeight = gameHeight;
            this.gameWidth = gameWidth;
            this.Image = document.getElementById('backgroundImage');
            this.x = 0; 
            this.y = 0;
            this.width = 2400; 
            this.height = 720;
            this.speed = 10;
        }
        draw(context) {
            context.drawImage(this.Image,this.x,this.y,this.width,this.height);
            context.drawImage(this.Image,this.x + this.width - this.speed,this.y,this.width,this.height);
        }
        update(){
            this.x -= this.speed;
            if(this.x < 0 - this.width) this.x = 0;
        }
    }

    class Enemy{
        constructor(gameWidth,gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.enemeyWidth = 160;
            this.enemyHeight = 119;
            this.image = document.getElementById('enemyImage');
            this.x = this.gameWidth - 100; 
            this.y = this.gameHeight - this.enemyHeight;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0; 
            this.frameInterval = 1000/this.fps;
            this.speed = 8;
            this.markedForDeletion = false;
        }
        draw(context){
            context.drawImage(this.image,this.frameX * this.enemeyWidth,0,this.enemeyWidth,this.enemyHeight,this.x,this.y,this.enemeyWidth,this.enemyHeight);
        }
        update(deltaTime){
            if(this.frameTimer > this.frameInterval) {
                if(this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            
            this.x -= this.speed;
            if(this.x < 0 - this.enemeyWidth) {
            this.markedForDeletion = true;
            score++;
            }
        }
    }
    
    function handleEnemies(deltaTime){
        if(enemyTimer > enemyInterval + randomEnemyInterval){
            enemies.push(new Enemy(canvas.width,canvas.height));
            enemyTimer = 0;
        }else{
            enemyTimer += deltaTime;
        }
        enemies.forEach(enemy => {
            enemy.draw(context);
            enemy.update(deltaTime);
        })
        enemies = enemies.filter(enemy => !enemy.markedForDeletion);
        
    }

    function displayStatusText(context){
        context.font = '40px Helvetica';
        context.fillStyle = 'black';
        context.fillText('Score : ' + score, 20,50);
        context.fillStyle = 'white';
        context.fillText('Score : ' + score, 22,52);
        if(gameOver){
            context.textAlign = 'center';
        context.fillStyle = 'black';
        context.fillText('Game Over, your score is ' + score, canvas.width/2,canvas.height/2);
        context.fillStyle = 'white';
        context.fillText('Game Over, your score is ' + score, canvas.width/2 + 5,canvas.height/2 + 2);
        }
    }


    const input = new InputHandler();
    const player = new Player(canvas.width,canvas.height);
    const background = new Background(canvas.width,canvas.height);

    let lastTime  = 0;
    let enemyTimer = 0;
    let enemyInterval = 2000;
    let randomEnemyInterval = Math.random() * 1000 + 500;
    
    function animate(timestamp){
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        context.clearRect(0,0,canvas.width,canvas.height);
       background.draw(context);
        background.update();
        player.draw(context);
        player.update(input,deltaTime,enemies);
        handleEnemies(deltaTime);
        displayStatusText(context);
        if(!gameOver)requestAnimationFrame(animate);
    }

    animate(0);
});