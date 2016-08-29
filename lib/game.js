const Cursor = require('./cursor.js');
const Obstacle = require('./obstacle.js');
const Util = require('./util.js');

let colorsIdx = 0;
let colorsLength = Util.colors.length;

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
    // canvas.width =  "1002";
    // canvas.height =  "800";
let x = canvas.width/2;
let y = canvas.height/2;
let ballRadius = 10;

let level = 1;
let difficulty = {
  gap: Util.fairRandom(0.2 * canvas.width, 70),
  gapLocation: Util.fairRandom(canvas.width),
  dy: 1,
  height: Util.fairRandom(150, 50),
  color: Util.colors[colorsIdx % colorsLength],
  m: 7
};

let interval1;
let interval2;
let interval3;

let mouseClickListener;
let listenerCount = 0;
let retryCallback;
let menuCallback;

function Game () {
  this.cursor = new Cursor(x, y, ballRadius, 40);
  this.score = 0;
  this.status = "intro";
  this.obstacles = [];
}

Game.prototype.generateObstacle = function () {
  this.obstacles.push(new Obstacle(
    difficulty.gap,
    difficulty.gapLocation,
    difficulty.dy,
    difficulty.height,
    difficulty.color,
    difficulty.m
  ));
  colorsIdx += 1;
  if (level < 10) {
    this.raiseDifficulty();
  } else {
    this.sustainDifficulty();
  }
  this.removeObstacle();
};

Game.prototype.raiseDifficulty = function () {
  difficulty = {
    gap: Util.fairRandom(0.2 * canvas.width, 70),
    gapLocation: Util.fairRandom(canvas.width),
    dy: 1,
    height: Util.fairRandom(150, 50),
    color: Util.colors[colorsIdx % colorsLength],
    m: 7
  };
};

Game.prototype.sustainDifficulty = function () {
  difficulty = {
    gap: Util.fairRandom(0.15 * canvas.width, 70),
    gapLocation: Util.fairRandom(canvas.width),
    dy: 4,
    height: Util.fairRandom(150, 100),
    color: Util.colors[colorsIdx % colorsLength],
    m: 20
  };
};

Game.prototype.removeObstacle = function () {
  let target = this.obstacles[0].inFrame() ? undefined : 0;
  if (target === 0) {
    this.obstacles.splice(target, 1);
  }
};

Game.prototype.drawScore = function () {
  ctx.font = "23px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("Score: "+ this.score, 50, 50);
};

Game.prototype.tickScore = function () {
  this.score += 1;
};

Game.prototype.gameOver = function () {
  canvas.style.cursor = 'default';
  this.status = 'gameOver';
  clearInterval(interval1);
  clearInterval(interval2);
  clearInterval(interval3);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  this.renderResult();

  retryCallback = this.checkRetry.bind(this);
  canvas.addEventListener("click", retryCallback);
};

Game.prototype.checkRetry = function (e) {
  let xRetry = this.cursor.x <= 500 && this.cursor.x >= 310;
  let yRetry = this.cursor.y <= 435 && this.cursor.y >= 400;
  if (xRetry && yRetry) {
    canvas.removeEventListener("click", retryCallback);
    this.score = 0;
    this.obstacles = [];
    this.start();
  }
};
Game.prototype.checkMenu = function (e) {
  let xRetry = this.cursor.x <= 500 && this.cursor.x >= 310;
  let yRetry = this.cursor.y <= 435 && this.cursor.y >= 400;
  if (xRetry && yRetry) {
    canvas.removeEventListener("click", menuCallback);
    this.score = 0;
    this.obstacles = [];
    this.start();
  }
};

Game.prototype.renderResult = function () {
  ctx.font = "70px Arial";
  ctx.fillStyle = "#000000";
  let temp =ctx.fillText("You Lost !!", 300, 250);

  ctx.font = "40px Arial";
  ctx.fillText("You scored: " + this.score, 310, 320);

  ctx.fillStyle = "#0095DD";
  ctx.font = "40px Arial";

  ctx.fillText("Play again", 310, 430);
};

Game.prototype.renderMenu = function () {
  menuCallback = this.checkMenu.bind(this);
  canvas.addEventListener("click", menuCallback);
  ctx.font = "Bold 70px San Serif";
  ctx.fillStyle = "#000000";
  // ctx.fillText("DON'T TOUCH", 250, 150);
  let text = "DON'T TOUCH";
  ctx.fillStyle = "red";
  ctx.fillText(text, 247, 150);
  ctx.fillStyle = "cyan";
  ctx.fillText(text, 252, 150);
  ctx.fillStyle = "#000";
  ctx.fillText(text, 250, 150);

  ctx.font = "30px Arial";
  ctx.fillText("How to play: ", 250, 220);
  ctx.font = "25px Arial";
  ctx.fillText("1: keep your cursor in the frame", 260, 260);
  ctx.fillText("2: Avoid the falling bars", 260, 300);

  ctx.fillStyle = "#0095DD";
  ctx.font = "50px Arial";

  ctx.fillText("Start!", 310, 430);
};

Game.prototype.inProgress = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  this.obstacles.forEach( (obs) => { obs.draw(); });
  this.drawScore();
  this.cursor.draw();

  // check for lose conditions
  if (this.cursor.outOfFrame()) { this.gameOver(); }
  this.obstacles.forEach( (obs) => {
    if (obs.detectCollision(this.cursor) ) {
      this.gameOver();
    }
  });
};

Game.prototype.start = function () {
  canvas.style.cursor = 'none';
  this.status = 'inProgress';
  interval1 = setInterval(this.generateObstacle.bind(this), 1000);
  interval2 = setInterval(this.inProgress.bind(this), 2);
  interval3 = setInterval(this.tickScore.bind(this), 100);
};

let game = new Game();
game.renderMenu();
