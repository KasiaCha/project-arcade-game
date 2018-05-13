// Enemies our player must avoid

var Enemy = function(x, y, speed) {
  "use strict";
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.sprite = 'images/Rock.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
  "use strict";
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = this.x + this.speed * dt;

  // Reset the enemy parameters
  this.offScreenX = 505;
  this.startingX = -105;
  if (this.x >= this.offScreenX) {
      this.x = this.startingX;
      this.randomSpeed();
  }
  this.checkCollision();
};

// Base Speed of the Enemy Rocks
var speedMultiplier = 50;

// Random speed generator
Enemy.prototype.randomSpeed = function (){
  "use strict";
  this.speed = speedMultiplier * Math.floor(Math.random() * 10 + 1);
};

// Render Enemy Rocks
Enemy.prototype.render = function() {
  "use strict";
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  ctx.fillStyle = "white";
  ctx.font = "16px Wallpoet";
  ctx.fillText("Score: " + player.playerScore, 50, 85);
  ctx.fillText("Lives: " + player.playerLives, 155, 85);
};

// Referenced https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
Enemy.prototype.checkCollision = function() {
  "use strict";

  var playerBox = {x: player.x, y: player.y, width: 50, height: 40};
  var enemyBox = {x: this.x, y: this.y, width: 60, height: 70};
  
  if (playerBox.x < enemyBox.x + enemyBox.width &&
      playerBox.x + playerBox.width > enemyBox.x &&
      playerBox.y < enemyBox.y + enemyBox.height &&
      playerBox.height + playerBox.y > enemyBox.y) {
      this.collisionDetected();
  }
};

// Collision detected
Enemy.prototype.collisionDetected = function() {
  "use strict";
  player.playerLives -= 1;
  player.characterReset();
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  "use strict";
  this.startingX = 200;
  this.startingY = 400;
  this.x = this.startingX;
  this.y = this.startingY;
  this.sprite = 'images/char-horn-girl.png';
  this.playerScore = 0;
  this.playerLives = 3;
};

// Reset game if player doesn't have lives
Player.prototype.update = function() {
  "use strict";
  if (this.playerLives === 0) {
  reset();
  }
};

// Reset the player position 
Player.prototype.characterReset = function() {
  "use strict";
  this.startingX = 200;
  this.startingY = 400;
  this.x = this.startingX;
  this.y = this.startingY;
};

// Increase score and level's difficulty
Player.prototype.success = function() {
  "use strict";
  this.playerScore += 20;
  speedMultiplier += 5;
  this.characterReset();
};

// Renders player
Player.prototype.render = function() {
  "use strict";
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Gem (star) the player should try to collect
var Gem = function() {
  "use strict";
  this.setGemLocation(); 
};

function gemLocation(){
  this.x = (101 * Math.floor(Math.random() * 4) + 0);
  this.y= (60 + (85 * Math.floor(Math.random() * 3) + 0));
};

Gem.prototype.setGemLocation = function() {
  
// Gem's value
  var gemValue = Math.floor(Math.random() * 100) + 1;
  
      this.sprite='images/Star.png';
      gemLocation.call(this);
      this.value = 5;  
};

// Update gem, call checkCollision
Gem.prototype.update = function() {
  "use strict";
  this.checkCollision();
};

// Render gem to the game
Gem.prototype.render = function() {
  "use strict";
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Check for collision
Gem.prototype.checkCollision = function() {
  "use strict";
  var playerBox = {x: player.x, y: player.y, width: 50, height: 40};

  var gemBox = {x: this.x, y: this.y, width: 60, height: 70};
  if (playerBox.x < gemBox.x + gemBox.width &&
      playerBox.x + playerBox.width > gemBox.x &&
      playerBox.y < gemBox.y + gemBox.height &&
      playerBox.height + playerBox.y > gemBox.y) {
      this.collisionDetected();
      }
};

Gem.prototype.collisionDetected = function() {
  "use strict";
  this.x = 900;
  this.y = 900;
  player.playerScore += gem.value;
  this.wait();
};

// Interval between gem creation
Gem.prototype.wait = function() {
  this.newGemCreation = setTimeout( function() {
      gem.gemReset(); 
  }, 1000);
};

// Resets Gem's location
Gem.prototype.gemReset = function() {
  "use strict";
  this.x = (101 * Math.floor(Math.random() * 4) + 0);
  this.y = (60 + (85 * Math.floor(Math.random() * 3) + 0));
};

// Move the player according to keys pressed
Player.prototype.handleInput = function(allowedKeys) {
  "use strict";
  switch (allowedKeys) {
      case "left":
          if (this.x > 0) {
              this.x -= 101;
          }
          break;
      case "right":
          if (this.x < 402) {
              this.x += 101;
          }
          break;
      case "up":
          if (this.y < 0) {
              this.success();
          } else {
              this.y -= 83;
          }
          break;
      case "down":
          if (this.y < 400) {
              this.y += 83;
          }
          break;
  }
};

// Instantiate Gem Object
var gem = new Gem();

// Instantiate Player object
var player = new Player();

// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0; i < 3; i++) {
  var startSpeed = speedMultiplier * Math.floor(Math.random() * 10 + 1);
  allEnemies.push(new Enemy(-100, 60 + (85 * i), startSpeed));
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
var input = function(e) {
  "use strict";
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
};
document.addEventListener('keyup', input);

// Prevents the window from scrolling up and down when the arrow keys are pressed.
window.addEventListener("keydown", function(e) {
  if ([38, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
  }
}, false);
