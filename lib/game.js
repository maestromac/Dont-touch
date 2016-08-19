const Cursor = require('./cursor.js');
const Obstacle = require('./obstacle.js');
const Util = require('./util.js');

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let x = canvas.width/2;
let y = canvas.height/2;
let ballRadius = 5;

function Game () {
  this.cursor = new Cursor(x, y, ballRadius);
  this.obstacles = [];
}

Game.prototype.generateObstacle = function () {
  this.obstacles.push(new Obstacle(
    Util.fairRandom(0.2 * canvas.width, 70),
    // canvas.width,
    Util.fairRandom(canvas.width),
    1,
    Util.fairRandom(200, 50)
  ));
};

Game.prototype.removeObstacle = function () {
  let target = this.obstacles[0].inFrame ? undefined : 0;

  if (target === 0) {
    this.obstacles.splice(target, 1);
  }
};

Game.prototype.inProgress = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  this.cursor.draw();
  this.obstacles.forEach( (obs) => {
    obs.draw();
    obs.detectCollision(this.cursor);
  });
};

Game.prototype.start = function () {
  setInterval(this.generateObstacle.bind(this), 1200);
  setInterval(this.inProgress.bind(this), 2);
};


let game = new Game();
game.start();
