// Enemies our player must avoid
class Enemy {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    constructor (x, y, speed){
        this.x=x;
        this.y=y;
        this.speed=speed;
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
    }
    //Source : https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    checkCollision(){
        if (player.x < this.x + 60 && 
            player.x + 50 > this.x &&
            player.y < this.y + 60 &&
            50 + player.y > this.y) {
            player.resetPosition();
            player.points = player.points - 1;
            player.life = player.life - 1;
            player.gameOver();
        }
        
    };

}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
     // make enemies loop to left side of canvas after reaching canvas.width
     if (this.x >= 505) {
        this.x = -100;
        this.speed = Math.random() * 500 + 80;
    }
    this.checkCollision();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player{
    constructor(x, y, position){
        this.x=x;
        this.y=y;
        this.sprite = 'images/char-cat-girl.png';
        this.position=position;
        this.points=0;
        this.pointsImage = 'images/Gem Green.png';
        this.life = 3;
        this.lifeImage = 'images/Heart.png';
    }
    update() { //updates player possitoin and prevents moving off screen
        if (this.x > 400){
            this.x = 400;
        }
        if (this.x < 0){
            this.x = 0;
        }
        if (this.y > 400){
            this.y = 400;
        }
        if (this.y <= 0){
            this.points += 3;
            player.resetPosition();
        }
    }
    drawPointsImage(){ 
        ctx.drawImage(Resources.get(this.pointsImage), 0, 50, 50, 50);// (x,y,hight,width)
        ctx.fillText(this.points, 65, 75);
    }
    drawLifeImage(){ 
        ctx.drawImage(Resources.get(this.lifeImage), 415, 50, 50, 50);//(x,y,hight,width)
        ctx.fillText(this.life, 470, 75);
    }
    render(){ //puts player on the screen along with score and life
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.fillStyle = 'white';
        ctx.font = "16px Arial";
        this.drawPointsImage();
        this.drawLifeImage();
    }
    handleInput(keyPress){
        if (keyPress==='left'){
            this.x -=  100;
        }
        if (keyPress==='up'){
            this.y -= 90;
        }
        if (keyPress==='right'){
            this.x += 100;
        }
        if (keyPress==='down'){
            this.y += 90;
        }
    }
    resetPosition(){
        this.x=200;
        this.y=400;
    }
    restartGame(){
        this.points = 0;
        this.life = 3;
    }
    gameOver(){
        if (this.life === 0){
            alert ("Game over! You got " + this.points + " point(s)!");
            this.restartGame();
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
let enemyY = [40, 130, 220];
enemyY.forEach(function(Y) {
    var enemy = new Enemy(-100, Y, Math.random() * 500 + 80);
    allEnemies.push(enemy);
});
var player = new Player(200,400,50);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

