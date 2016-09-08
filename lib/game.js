const Cursor = require('./cursor.js');
const Obstacle = require('./obstacle.js');
const Util = require('./util.js');
const MenuBlocks = require('./menu_blocks.js');

let colorsIdx = 0;
let colorsLength = Util.colors.length;

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let x = canvas.width/2;
let y = canvas.height/2;
let ballRadius = 8;

let percent = 0.25;
let difficulty;

let interval1;
let interval2;
let interval3;
let menuInterval;
let blackInterval;
let scoreInterval;
let highScore;

let mouseClickListener;
let listenerCount = 0;
let retryCallback;
let menuCallback;

function Game () {
  this.cursor = new Cursor(x, y, ballRadius, 10);
  this.score = 0;
  this.status = "intro";
  this.obstacles = [];
  this.menuBlocks = new MenuBlocks(13, 4);
  this.blackBlocks = new MenuBlocks(13, 4, true);
}

Game.prototype.generateObstacle = function () {
  this.raiseDifficulty();
  this.obstacles.push(new Obstacle(
    difficulty.gap,
    difficulty.gapLocation,
    difficulty.dy,
    difficulty.height,
    difficulty.color,
    difficulty.m
  ));
  colorsIdx += 1;
  this.removeObstacle();
};

Game.prototype.raiseDifficulty = function () {
  if (percent > 0.03) {
    percent -= 0.001;
  }
  console.log(percent);
  difficulty = {
    gap: Util.fairRandom(
      (percent + (0.3*percent)) * canvas.width,
      percent * canvas.width
    ),
    gapLocation: Util.fairRandom(canvas.width),
    dy: 2.5,
    height: Util.fairRandom(40, 40),
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
  ctx.font = "small-caps bold 20px arial";
  ctx.fillStyle = "white";
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
  this.scoreBlocks = new MenuBlocks(13, 20);
  Util.sleep(450).then(() => {
    scoreInterval = setInterval(this.drawScoreBlocks.bind(this), 2);
  });
};

Game.prototype.checkRetry = function (e) {
  let xRetry = this.cursor.x <= canvas.width && this.cursor.x >= 0;
  let yRetry = this.cursor.y <= canvas.height && this.cursor.y >= 0;
  if (xRetry && yRetry) {
    canvas.removeEventListener("click", retryCallback);
    this.blackBlocks = new MenuBlocks(13, 10, true);
    this.cursor = new Cursor(x, y, ballRadius, 40);
    this.score = 0;
    this.obstacles = [];
    blackInterval = setInterval(this.drawBlackBlocks.bind(this), 2);
  }
};
Game.prototype.checkMenu = function (e) {
  let xFrame = this.cursor.x <= canvas.width && this.cursor.x >= 0;
  let yFrame = this.cursor.y <= canvas.height && this.cursor.y >= 0;
  if (xFrame && yFrame) {
    canvas.removeEventListener("click", menuCallback);
    this.score = 0;
    this.obstacles = [];
    blackInterval = setInterval(this.drawBlackBlocks.bind(this), 2);
  }
};

Game.prototype.renderResult = function () {
  this.updateHighScore();
  this.scoreLogo(150, 150);
  this.bestLogo(185, 250);
  ctx.font = "bold 80px serif";
  ctx.fillStyle = "white";
  ctx.fillText(this.score, 580, 220);
  ctx.fillText(highScore, 580, 320);
  this.retryLogo(330, 450);
};

Game.prototype.updateHighScore = function () {
  highScore = localStorage.getItem('highScore');
  if (highScore !== null) {
    if (this.score > highScore) {
      localStorage.setItem('highScore', this.score);
      highScore = this.score;
    }
  } else {
    localStorage.setItem('highScore', this.score);
    highScore = this.score;
  }
  return highScore;
};

Game.prototype.drawMenuBlocks = function () {
  this.menuBlocks.draw();
  if (this.menuBlocks.done) {
    clearInterval(menuInterval);
    menuCallback = this.checkMenu.bind(this);
    canvas.addEventListener("click", menuCallback);
    this.logo();
    this.startButton();
  }
};

Game.prototype.drawBlackBlocks = function () {
  this.blackBlocks.draw();
  if (this.blackBlocks.done) {
    clearInterval(blackInterval);
    this.start();
  }
};

Game.prototype.drawScoreBlocks = function () {
  this.scoreBlocks.draw();
  if (this.scoreBlocks.done) {
    clearInterval(scoreInterval);
    this.renderResult();
    retryCallback = this.checkRetry.bind(this);
    canvas.addEventListener("click", retryCallback);
  }
};

Game.prototype.renderMenu = function () {
  menuInterval = setInterval(this.drawMenuBlocks.bind(this), 2);
};

Game.prototype.logo = function () {
  let logo = new Image();
  logo.src = './assets/images/logo.png';
  logo.onload = function () {
    ctx.drawImage(logo, 110, 100 );
  };
};

Game.prototype.scoreLogo = function (xPos, yPos) {
  let logo = new Image();
  logo.src = './assets/images/score.png';
  logo.onload = function () {
    ctx.drawImage(logo, xPos, yPos);
  };
};

Game.prototype.startButton = function () {
  let logo = new Image();
  logo.src = './assets/images/start.png';
  logo.onload = function () {
    ctx.drawImage(logo, 300, 350 );
  };
};
Game.prototype.lostLogo = function () {
  let logo = new Image();
  logo.src = './assets/images/lost.png';
  logo.onload = function () {
    ctx.drawImage(logo, 180, 100 );
  };
};
Game.prototype.retryLogo = function (xPos, yPos) {
  let logo = new Image();
  logo.src = './assets/images/retry.png';
  logo.onload = function () {
    ctx.drawImage(logo, xPos, yPos );
  };
};

Game.prototype.bestLogo = function (xPos, yPos) {
  let logo = new Image();
  logo.src = './assets/images/best.png';
  logo.onload = function () {
    ctx.drawImage(logo, xPos, yPos);
  };
};

Game.prototype.inProgress = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  this.obstacles.forEach( (obs) => { obs.draw(); });
  this.cursor.draw();

  if (this.cursor.outOfFrame()) { this.gameOver(); }
  this.obstacles.forEach( (obs) => {
    if (obs.detectCollision(this.cursor) ) {
      this.gameOver();
    }
  });

  this.drawScore();
};

Game.prototype.start = function () {
  canvas.style.cursor = 'none';
  this.status = 'inProgress';
  interval1 = setInterval(this.generateObstacle.bind(this), 750);
  interval2 = setInterval(this.inProgress.bind(this), 15);
  interval3 = setInterval(this.tickScore.bind(this), 100);
};

let game = new Game();
game.renderMenu();
